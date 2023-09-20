import { ClassicListenersCollector } from "@empirica/core/admin/classic"
export const Empirica = new ClassicListenersCollector()

Empirica.onGameStart(({ game }) => {})

Empirica.onRoundStart(({ round }) => {})

Empirica.onStageStart(({ stage }) => {})

Empirica.onStageEnded(({ stage }) => {})

Empirica.onRoundEnded(({ round }) => {})

Empirica.onGameEnded(({ game }) => {})

export function getOpenBatches(ctx) {
  // return array of open batches

  const batches = ctx.scopesByKind("batch") // returns Map object
  // players can join an open batch

  const openBatches = []

  for (const [, batch] of batches) {
    if (batch.get("status") === "running") openBatches.push(batch)
  }

  return openBatches
}

export function selectOldestBatch(batches) {
  if (!Array.isArray(batches)) return undefined
  if (!batches.length > 0) return undefined

  let currentOldestBatch = batches[0]
  for (const comparisonBatch of batches) {
    try {
      if (
        Date.parse(currentOldestBatch.get("createdAt")) >
        Date.parse(comparisonBatch.get("createdAt"))
      )
        currentOldestBatch = comparisonBatch
    } catch (err) {
      console.log(
        `Failed to parse createdAt timestamp for Batch ${comparisonBatch.id}`
      )
      console.log(err)
    }
  }
  return currentOldestBatch
}

// Empirica.on("game", (ctx, { game }) => {
//   if (game.get("initialize")) return
//   game.set("initialize", true)

//   const players = ctx.scopesByKind("player")
//   const startingPlayerId = game.get("startingPlayerId")
//   const startingPlayer = players.get(startingPlayerId)

//   game.assignPlayer(startingPlayer)
//   game.start()
// })

Empirica.on("player", (ctx, { player }) => {
  console.log("on player called")
  if (player.get("initialize")) {
    console.log("onplayer returned")
    return
  }
  player.set("initialize", true)

  if (player.currentGame) {
    // TODO look here for bug in intro - blank page needed to refresh before seeing nickname screen
    // case where join is called every refresh, reasigning the player to the game and filling spaces
    console.log(`player: ${player.id} has already been assigned to a game`)
    return
  }

  const filterParams = player.get("filterParams") // taking from the url parameters on the NewPlayer page

  let treatmentsVector = [] // array of available treatments in the batch
  const allBatches = getOpenBatches(ctx)
  // //const batch = selectOldestBatch(allBatches) // from j houghton
  allBatches.forEach((_batch) => {
    // whenever you create a new batch in the admin panel, it will be added to the array of batches. We need to look through all of the batches and all of the treatments inside those batches to see if they have open spaces. Treatments with available spaces are added to the treatments vector
    // console.log(_batch.values())
    const allTreatments = _batch.get("config").config.treatments
    allTreatments.forEach((_treatment) => {
      const currentPlayerCount =
        _batch.get(`${_treatment.treatment.name}PlayerCount`) || 0

      if (currentPlayerCount < _treatment.treatment.factors.playerCount) {
        treatmentsVector = [
          ...treatmentsVector,
          {
            batchId: _batch.id,
            hasEnded: _batch.hasEnded,
            treatment: _treatment.treatment.factors,
            treatmentName: _treatment.treatment.name,
          },
        ]
      }

      if (!_batch.get(`${_treatment.treatment.name}PlayerCount`)) {
        _batch.set(`${_treatment.treatment.name}PlayerCount`, 0)
      }

      console.log(_treatment.treatment.name, currentPlayerCount)
    })
  })

  if (treatmentsVector.length === 0) {
    // console.log("Error is no batches")
    player.set("error", true)
    player.set("errorCode", "noBatches")
    return
  }

  const sortedTreatmentVector = treatmentsVector.sort((a, b) =>
    a.batchId > b.batchId ? 1 : -1
  )

  let filteredTreatments = sortedTreatmentVector
  if (filterParams) {
    // if there are filter parameters, we need to find the treatments that match the url parameters
    filteredTreatments = sortedTreatmentVector.filter(function (_treatment) {
      return Object.keys(filterParams).every(function (key) {
        if (!Object.keys(_treatment.treatment).includes(key)) {
          // only use the keys from the url parameter that match a factor in the treatment. e.g. a random url parameter wouldn't affect this filter process.
          return true
        }
        return _treatment.treatment[key] === filterParams[key]
      })
    })
  }
  if (filteredTreatments.length === 0) {
    // console.log("no games")
    player.set("error", true)
    player.set("errorCode", "gamesFull")
    return
  }

  let finalTreatmentVector = []
  filteredTreatments.forEach((_treatment) => {
    // if there are multiple available of the same treatment, we only want to consider the first of each.
    const observedTreatments = finalTreatmentVector.map((entry) => {
      return entry?.treatmentName // array of treatment names in final vector
    })
    if (observedTreatments.includes(_treatment.treatmentName)) {
      return // skip if treatment name already in final vector
    }
    finalTreatmentVector = [...finalTreatmentVector, _treatment]
  })

  shuffleArray(finalTreatmentVector) //shuffles vector in place. If there are multiple options then taking the first treatment in the shuffled vector represents a random choice between them
  let selectedTreatment = finalTreatmentVector[0]
  const batchId = selectedTreatment.batchId // get batch id of selected treatment and select batch object that matches this id
  const batch = Array.from(ctx.scopesByKind("batch").values()).find(
    (_batch) => _batch.id === batchId
  )

  const selectedPlayerCount = batch.get(
    `${selectedTreatment.treatmentName}PlayerCount`
  )

  const availableGames = batch.games
    .filter(function (_game) {
      const curentPlayerCount = _game.players.length || 0
      return curentPlayerCount < selectedTreatment.treatment.playerCount
    })
    .sort((a, b) => (a.timeStamp > b.timeStamp ? 1 : -1))

  const game =
    availableGames.length === 1
      ? availableGames[0]
      : availableGames[Math.floor(Math.random() * availableGames.length)]

  if (!game) {
    let prePopulatedComments = selectedTreatment.treatment.prePopulatedComments
    if (
      typeof prePopulatedComments === "string" ||
      prePopulatedComments instanceof String
    ) {
      prePopulatedComments = prePopulatedComments
        .split("##")
        .reduce((accumulator, _comments, index) => {
          return {
            ...accumulator,
            [index]: _comments.split("%%").map((_comment, subIndex) => {
              return {
                id: `prePopulate_${subIndex}`,
                text: _comment,
                timeStamp: null,
                author: "prePopulated",
                agree: 0,
                disagree: 0,
                uncertain: 0,
              }
            }),
          }
        }, {})

      selectedTreatment.treatment["prePopulatedComments"] = prePopulatedComments
    }

    let questionsArray = selectedTreatment.treatment.questions
    if (
      typeof questionsArray === "string" ||
      questionsArray instanceof String
    ) {
      questionsArray = questionsArray.split("%%").map((_questionInfo) => {
        const _questionSplit = _questionInfo.split("&&")
        return {
          question: _questionSplit[0],
          moreDetails: _questionSplit[1],
        }
      })
      selectedTreatment.treatment["questions"] = questionsArray
    }

    const messagesObject = questionsArray.reduce((acc, _q) => {
      return [...acc, []]
    }, [])

    batch.addGame([
      // {
      //   key: "startingPlayerId",
      //   value: player.id,
      // },
      { key: "treatment", value: selectedTreatment.treatment },
      { key: "messaes", value: messagesObject },
      { key: "comments", value: prePopulatedComments },
      { key: "timeStamp", value: new Date().getTime() },
    ])

    batch.set(
      `${selectedTreatment.treatmentName}PlayerCount`,
      selectedPlayerCount + 1
    )

    return // first player is assigned after the game is created
  }
  // selected batch and treatment has a game with available spaces
  // console.log(game.players)
  const players = ctx.scopesByKind("player")
  console.log(`number of players: ${players.length}`)
  console.log(`number of players: ${game.players.length}`)
  game.assignPlayer(player)
  batch.set(
    `${selectedTreatment.treatmentName}PlayerCount`,
    selectedPlayerCount + 1
  )
})

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

function sendVerificationEmail(verificationCode, emailAddress) {
  const client = new postmark.ServerClient(postmarkApiKey)
  client.sendEmail({
    From: "joshua.becker@ucl.ac.uk",
    To: emailAddress,
    Subject: "asynchronous empirica",
    TextBody: `Your verification code is: ${verificationCode}`,
  })
}

function sendURLEmail(url, emailAddress) {
  const client = new postmark.ServerClient(postmarkApiKey)
  client.sendEmail({
    From: "joshua.becker@ucl.ac.uk",
    To: emailAddress,
    Subject: "asynchronous empirica",
    TextBody: `Your magic link is: ${url}. Please use this for future access.\n`,
  })
}

function sendUpdateEmail(url, emailAddress, emailBody, username, hasUpdates) {
  const client = new postmark.ServerClient(postmarkApiKey)
  client.sendEmail({
    From: "joshua.becker@ucl.ac.uk",
    To: emailAddress,
    Subject: hasUpdates
      ? `${username} your forecasting portal has updates!`
      : `${username}, update your forecasting portal!`,
    TextBody: `${emailBody}`,
  })
}
