document.addEventListener('DOMContentLoaded', () => {
    initializeQuiz()
  })
  
  let score = 0
  let currentQuestionIndex = 0
  const totalQuestions = 10
  
  function initializeQuiz() {
    window.electron.onNewQuestion((question) => {
      displayQuestion(question)
    })
    fetchNewQuestion()
  }
  
  function displayQuestion(question) {
    const quizContainer = document.getElementById('quizz')
    quizContainer.innerHTML = ''
    
    const questionDiv = document.createElement('div')
    questionDiv.className = 'question'
    
    const questionTitle = document.createElement('h2')
    questionTitle.textContent = question.question
    questionDiv.appendChild(questionTitle)
    
    question.answers.forEach(answer => {
      const answerLabel = document.createElement('label')
      const answerInput = document.createElement('input')
      answerInput.type = 'radio'
      answerInput.name = 'question'
      answerInput.value = String(answer.correct)
      answerLabel.appendChild(answerInput)
      answerLabel.appendChild(document.createTextNode(answer.answer))
      
      answerInput.addEventListener('click', () => {
        checkAnswer(answer.correct, question)
      })
      
      questionDiv.appendChild(answerLabel)
      questionDiv.appendChild(document.createElement('br'))
    })
    
    quizContainer.appendChild(questionDiv)
    
    const remainingQuestionsDiv = document.createElement('div')
    remainingQuestionsDiv.id = 'remaining-questions'
    remainingQuestionsDiv.textContent = `Questions restantes : ${totalQuestions - currentQuestionIndex}`
    quizContainer.appendChild(remainingQuestionsDiv)
  }
  
  function checkAnswer(isCorrect, question) {
    const quizContainer = document.getElementById('quizz')
    const resultContainer = document.getElementById('result') || document.createElement('div')
    resultContainer.id = 'result'
    
    if (String(isCorrect) === 'true') {
      score++
      resultContainer.textContent = 'Bonne réponse!'
      resultContainer.style.color = 'green'
    } else {
      resultContainer.textContent = `Mauvaise réponse. La bonne réponse était : ${question.answers.find(ans => ans.correct).answer}`
      resultContainer.style.color = 'red'
    }
    
    quizContainer.appendChild(resultContainer)
    disableRadioButtons()
    displayNextButton()
  }
  
  function disableRadioButtons() {
    const radioButtons = document.querySelectorAll('input[name="question"]')
    radioButtons.forEach(button => button.disabled = true)
  }
  
  function displayNextButton() {
    const quizContainer = document.getElementById('quizz')
    const nextButton = document.createElement('button')
    nextButton.id = 'next-button'
    nextButton.textContent = 'Question suivante'
    nextButton.addEventListener('click', () => {
      if (currentQuestionIndex < totalQuestions - 1) {
        currentQuestionIndex++
        fetchNewQuestion()
      } else {
        displayFinalScore()
      }
    })
    quizContainer.appendChild(nextButton)
  }
  
  function fetchNewQuestion() {
    window.electron.requestNewQuestion()
  }
  
  function displayFinalScore() {
    const quizContainer = document.getElementById('quizz')
    quizContainer.innerHTML = ''
    
    const finalScoreDiv = document.createElement('div')
    finalScoreDiv.className = 'final-score'
    finalScoreDiv.id = 'final-score'
    finalScoreDiv.textContent = `Quiz terminé! Vous avez obtenu ${score} bonnes réponses sur ${totalQuestions} questions.`
    quizContainer.appendChild(finalScoreDiv)
  
    const replayButton = document.createElement('button')
    replayButton.textContent = 'Rejouer'
    replayButton.id = 'replay-button'
    replayButton.addEventListener('click', () => {
      resetQuiz()
    })
    quizContainer.appendChild(replayButton)
  
    const quitButton = document.createElement('button')
    quitButton.textContent = 'Quitter'
    quitButton.id = 'quit-button'
    quitButton.addEventListener('click', () => {
      window.electron.quitApp()
    })
    quizContainer.appendChild(quitButton)
  }
  
  function resetQuiz() {
    score = 0
    currentQuestionIndex = 0
    initializeQuiz()
  }
  