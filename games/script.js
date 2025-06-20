document.addEventListener('DOMContentLoaded', () => {
    const letters = document.querySelectorAll('#game-title span');

    const wiggleLetters = () => {
        letters.forEach(letter => {
            const rotation = Math.random() * 30 - 15; // Random rotation between -15deg and 15deg
            letter.style.transform = `rotate(${rotation}deg)`;
        });
    };

    setInterval(wiggleLetters, 250); // Update every quarter of a second
    wiggleLetters(); // Initial wiggle

    // Modal logic
    const playButton = document.getElementById('play-button');
    const modal = document.getElementById('name-modal');
    const closeModal = document.getElementById('close-modal');
    const startGameButton = document.getElementById('start-game-button');
    const playerNameInput = document.getElementById('player-name');
    const mainMenuContainer = document.querySelector('.main-menu-container');
    const gameContent = document.getElementById('game-content');
    const quizContainer = document.getElementById('quiz-container');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizInputContainer = document.getElementById('quiz-input-container');
    const nextQuestionButton = document.getElementById('next-question-button');
    const storySummaryContainer = document.getElementById('story-summary-container');
    const storySummaryContent = document.getElementById('story-summary-content');
    const copyStoryButton = document.getElementById('copy-story-button');
    const dareContainer = document.getElementById('dare-container');
    const dressUpContainer = document.getElementById('dress-up-container');

    // Agar.io elements
    const agarioContainer = document.getElementById('agario-container');
    const gameCanvas = document.getElementById('game-canvas');
    const timerEl = document.getElementById('timer');
    const scoreEl = document.getElementById('score');
    const agarioEndScreen = document.getElementById('agario-end-screen');
    const agarioEndTitle = document.getElementById('agario-end-title');
    const agarioEndMessage = document.getElementById('agario-end-message');
    const retryAgarioButton = document.getElementById('retry-agario-button');
    const giveUpAgarIoButton = document.getElementById('give-up-agario-button');

    playButton.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    let gameState = {};
    let agarioState = {};

    const questions = [
        { key: 'color', question: "What color do you associate with happiness?", type: 'text-input', placeholder: "e.g., sunny yellow..." },
        {
            key: 'superpower',
            question: "If you could have one superpower, what would it be?",
            type: 'multiple-choice',
            options: [
                'Flight', 'Invisibility', 'Teleportation', 'Super Strength', 
                'Mind Reading', 'Healing', 'Time Travel', 'Talking to Animals'
            ]
        },
        { key: 'song', question: "What's a song that makes you feel nostalgic?", type: 'text-input', placeholder: "A song from your childhood..." },
        { key: 'peace', question: "Describe a place where you feel completely at peace.", type: 'text-input', placeholder: "A quiet forest, a bustling city cafe..." },
        { key: 'admire', question: "What is a quality you admire in others?", type: 'text-input', placeholder: "Kindness, courage, humor..." },
        { key: 'pride', question: "What's something you're proud of, but don't talk about much?", type: 'text-input', placeholder: "A personal achievement..." },
        { key: 'crush', question: "Who was your first crush?", type: 'text-input', placeholder: "A name, a character..." },
    ];

    const personalQuestion = {
        key: 'secret',
        question: "What's a secret you've never told anyone?",
        type: 'text-input',
        placeholder: "Your secret is safe here..."
    };

    const startNewGame = (playerName) => {
        gameState = {
            playerName: playerName,
            answers: {},
            currentQuestionIndex: 0
        };
        console.log('Starting new game for:', playerName);
        modal.style.display = 'none';
        
        mainMenuContainer.classList.add('off-screen');

        mainMenuContainer.addEventListener('transitionend', () => {
            mainMenuContainer.style.display = 'none';

            gameContent.style.display = 'flex';
            // A short delay to allow the element to be rendered before transitioning.
            setTimeout(() => {
                quizContainer.style.display = 'block';
                quizContainer.classList.add('on-screen');
                showQuestion(gameState.currentQuestionIndex);
            }, 50);
            
        }, { once: true });
    };

    const showQuestion = (index) => {
        if (index >= questions.length) {
            endGame();
            return;
        }

        const question = questions[index];
        quizQuestion.textContent = question.question;

        // Clear previous content
        quizOptions.innerHTML = '';
        quizInputContainer.innerHTML = '';
        nextQuestionButton.style.display = 'none';

        if (question.type === 'multiple-choice') {
            quizOptions.style.display = 'flex';
            question.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option;
                button.dataset.answer = option;
                button.addEventListener('click', handleAnswer);
                quizOptions.appendChild(button);
            });
        } else if (question.type === 'text-input') {
            quizOptions.style.display = 'none';
            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'text-answer-input';
            input.placeholder = question.placeholder;
            quizInputContainer.appendChild(input);

            nextQuestionButton.style.display = 'inline-block';
            nextQuestionButton.onclick = () => handleAnswer(null, input.value);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleAnswer(null, input.value);
                }
            });
        }
    };

    const handleAnswer = (event, textValue) => {
        const question = questions[gameState.currentQuestionIndex];
        let answer;

        if (question.type === 'multiple-choice') {
            answer = event.target.dataset.answer;
        } else {
            answer = textValue.trim();
            if (!answer) {
                alert("Please write something!");
                return;
            }
        }
        
        gameState.answers[question.key] = answer;
        gameState.currentQuestionIndex++;

        // Since the last question is no longer a text input, we need to check differently.
        // It's just simpler to check the index.
        if (gameState.currentQuestionIndex >= questions.length) {
            endGame();
        } else {
            showQuestion(gameState.currentQuestionIndex);
        }
    };

    const endGame = () => {
        quizContainer.classList.remove('on-screen');
        quizContainer.addEventListener('transitionend', () => {
            quizContainer.style.display = 'none';
            startAgarIoGame();
        }, { once: true });
    };

    const generateStoryText = (state) => {
        let story = `I know you, ${state.playerName}.
You associate happiness with the color ${state.answers.color}.
If you had a superpower, it would be ${state.answers.superpower}.
The song "${state.answers.song}" makes you feel nostalgic.
You feel at peace when you think of "${state.answers.peace}".
A quality you admire in others is "${state.answers.admire}".
You're secretly proud of "${state.answers.pride}".
Your first crush was ${state.answers.crush}.`;

        if (state.answers.secret) {
            story += `\nAnd you hold a secret: "${state.answers.secret}".`;
        }
        if (state.answers.truth) {
            story += `\nYour biggest regret is "${state.answers.truth}".`;
        }
        if (state.answers.dareCompleted) {
            story += `\nYou were brave enough to complete the dare.`;
        }
        return story;
    };

    const showStorySummary = () => {
        const storyText = generateStoryText(gameState);
        storySummaryContent.innerHTML = storyText.replace(/\n/g, '<br>');
        
        const activeContainer = document.querySelector('.agario-container.on-screen, .quiz-container.on-screen, .dare-container.on-screen, .dress-up-container.on-screen');
        if (activeContainer) {
            activeContainer.classList.remove('on-screen');
            activeContainer.addEventListener('transitionend', () => {
                activeContainer.style.display = 'none';
                storySummaryContainer.style.display = 'block';
                setTimeout(() => {
                    storySummaryContainer.classList.add('on-screen');
                }, 50);
            }, {once: true});
        } else {
             // Fallback for continue game or other edge cases
             agarioContainer.style.display = 'none';
             quizContainer.style.display = 'none';
             dareContainer.style.display = 'none';
             dressUpContainer.style.display = 'none';
             storySummaryContainer.style.display = 'block';
             setTimeout(() => {
                storySummaryContainer.classList.add('on-screen');
            }, 50);
        }
    };

    copyStoryButton.addEventListener('click', () => {
        const storyText = generateStoryText(gameState);
        navigator.clipboard.writeText(storyText).then(() => {
            alert('Your memories have been copied to the clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy your memories. Please try again.');
        });
    });

    const continueGameWithData = (data) => {
        const parsedState = { playerName: '', answers: {} };
        const lines = data.split('\n');
        
        try {
            parsedState.playerName = lines[0].match(/I know you, (.*)\./)[1];
            parsedState.answers.color = lines[1].match(/You associate happiness with the color (.*)\./)[1];
            parsedState.answers.superpower = lines[2].match(/If you had a superpower, it would be (.*)\./)[1];
            parsedState.answers.song = lines[3].match(/The song "(.*)" makes you feel nostalgic\./)[1];
            parsedState.answers.peace = lines[4].match(/You feel at peace when you think of "(.*)"\./)[1];
            parsedState.answers.admire = lines[5].match(/A quality you admire in others is "(.*)"\./)[1];
            parsedState.answers.pride = lines[6].match(/You're secretly proud of "(.*)"\./)[1];
            parsedState.answers.crush = lines[7].match(/Your first crush was (.*)\./)[1];
            
            const secretLine = lines.find(line => line.startsWith("And you hold a secret:"));
            if (secretLine) {
                 parsedState.answers.secret = secretLine.match(/And you hold a secret: "(.*)"\./)[1];
            }
            const truthLine = lines.find(line => line.startsWith("Your biggest regret is"));
            if (truthLine) {
                 parsedState.answers.truth = truthLine.match(/Your biggest regret is "(.*)"\./)[1];
            }
            const dareLine = lines.find(line => line.startsWith("You were brave enough"));
            if (dareLine) {
                 parsedState.answers.dareCompleted = true;
            }

            gameState = parsedState; // Set the global game state

            modal.style.display = 'none';
            mainMenuContainer.classList.add('off-screen');
            mainMenuContainer.addEventListener('transitionend', () => {
                mainMenuContainer.style.display = 'none';
                gameContent.style.display = 'flex';
                showStorySummary();
            }, { once: true });

        } catch (error) {
            console.error("Failed to parse save data:", error);
            alert("The memories you provided seem to be corrupted. Please check the format and try again.");
        }
    };

    // --- AGAR.IO GAME LOGIC ---
    const startAgarIoGame = () => {
        agarioContainer.style.display = 'flex';
        agarioEndScreen.style.display = 'none';
        setTimeout(() => {
            agarioContainer.classList.add('on-screen');
            initAgarIo();
        }, 50);
    };
    
    const initAgarIo = () => {
        const ctx = gameCanvas.getContext('2d');
        const canvasWidth = gameCanvas.clientWidth;
        const canvasHeight = gameCanvas.clientHeight;
        gameCanvas.width = canvasWidth;
        gameCanvas.height = canvasHeight;

        agarioState = {
            player: { x: canvasWidth / 2, y: canvasHeight / 2, radius: 20, color: '#32CD32' },
            food: [],
            score: 0,
            timeLeft: 120,
            gameActive: true,
            mouse: { x: canvasWidth / 2, y: canvasHeight / 2 },
            animationFrameId: null,
            timerId: null
        };

        for (let i = 0; i < 100; i++) {
            spawnFood();
        }

        scoreEl.textContent = 0;
        timerEl.textContent = 120;
        
        // Clear previous mouse listeners if any, though it's generally safe
        const newCanvas = gameCanvas.cloneNode(true);
        gameCanvas.parentNode.replaceChild(newCanvas, gameCanvas);
        const newCtx = newCanvas.getContext('2d');
        agarioState.ctx = newCtx;

        newCanvas.addEventListener('mousemove', e => {
            const rect = newCanvas.getBoundingClientRect();
            agarioState.mouse.x = e.clientX - rect.left;
            agarioState.mouse.y = e.clientY - rect.top;
        });

        agarioState.timerId = setInterval(updateTimer, 1000);
        gameLoop();
    };

    const spawnFood = () => {
        const foodColors = ['#FF6347', '#FFD700', '#ADFF2F', '#40E0D0', '#EE82EE'];
        agarioState.food.push({
            x: Math.random() * gameCanvas.width,
            y: Math.random() * gameCanvas.height,
            radius: 7,
            color: foodColors[Math.floor(Math.random() * foodColors.length)]
        });
    };
    
    const updateTimer = () => {
        if (!agarioState.gameActive) return;
        agarioState.timeLeft--;
        timerEl.textContent = agarioState.timeLeft;
        if (agarioState.timeLeft <= 0) {
            endAgarIoGame(false); // Lose
        }
    };

    const gameLoop = () => {
        if (!agarioState.gameActive) return;

        const { player, food, mouse } = agarioState;
        const ctx = agarioState.ctx || gameCanvas.getContext('2d');
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Move player
        const dx = mouse.x - player.x;
        const dy = mouse.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 3; // a bit slow to feel 'heavy'
        if (dist > 1) {
            player.x += (dx / dist) * speed;
            player.y += (dy / dist) * speed;
        }

        // Check food collision
        for (let i = food.length - 1; i >= 0; i--) {
            const f = food[i];
            const distBetween = Math.sqrt((player.x - f.x)**2 + (player.y - f.y)**2);
            if (distBetween < player.radius - f.radius / 2) { // eat when center of food is inside player
                food.splice(i, 1);
                spawnFood();
                agarioState.score += 5;
                player.radius = Math.sqrt(player.radius**2 + 5); // Area increases by 5
                scoreEl.textContent = agarioState.score;

                if (agarioState.score >= 250) {
                    endAgarIoGame(true); // Win
                    return; // Stop loop immediately
                }
            }
        }

        // Draw food
        food.forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = f.color;
            ctx.fill();
        });
        
        // Draw player
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 4;
        ctx.fill();
        ctx.stroke();

        agarioState.animationFrameId = requestAnimationFrame(gameLoop);
    };

    const endAgarIoGame = (isWin) => {
        agarioState.gameActive = false;
        cancelAnimationFrame(agarioState.animationFrameId);
        clearInterval(agarioState.timerId);

        if (isWin) {
            askFinalQuestion();
        } else {
            // Show lose screen
            agarioEndScreen.style.display = 'flex';
        }
    };

    const askFinalQuestion = () => {
        agarioContainer.classList.remove('on-screen');
        agarioContainer.addEventListener('transitionend', () => {
            agarioContainer.style.display = 'none';

            // Reuse the quiz container
            quizContainer.style.display = 'block';
            setTimeout(() => {
                quizContainer.classList.add('on-screen');
                // Populate the quiz container with the personal question
                quizQuestion.textContent = personalQuestion.question;

                // Clear previous content
                quizOptions.innerHTML = '';
                quizInputContainer.innerHTML = '';
                
                quizOptions.style.display = 'none';
                const input = document.createElement('input');
                input.type = 'text';
                input.id = 'text-answer-input';
                input.placeholder = personalQuestion.placeholder;
                quizInputContainer.appendChild(input);

                nextQuestionButton.textContent = 'Finish'; // Maybe change button text
                nextQuestionButton.style.display = 'inline-block';
                
                const onFinish = () => {
                    const answer = input.value.trim();
                    if (!answer) {
                        alert("Please write something!");
                        return;
                    }
                    gameState.answers[personalQuestion.key] = answer;
                    input.removeEventListener('keypress', onEnter);
                    nextQuestionButton.onclick = null;
                    startTruthOrDare();
                };

                const onEnter = (e) => {
                    if (e.key === 'Enter') {
                        onFinish();
                    }
                };
                
                nextQuestionButton.onclick = onFinish;
                input.addEventListener('keypress', onEnter);
                input.focus();

            }, 50);
        }, { once: true });
    };
    
    retryAgarioButton.addEventListener('click', () => {
        agarioEndScreen.style.display = 'none';
        initAgarIo();
    });

    giveUpAgarIoButton.addEventListener('click', () => {
        showStorySummary(); // Show summary without the secret
    });

    startGameButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        
        if (playerName) {
            startNewGame(playerName);
        } else {
            alert('Please enter your name to start!');
        }
    });

    const startTruthOrDare = () => {
        quizQuestion.textContent = "One last thing... Truth or Dare?";

        quizOptions.innerHTML = '';
        quizInputContainer.innerHTML = '';
        nextQuestionButton.style.display = 'none';

        quizOptions.style.display = 'flex';

        const truthButton = document.createElement('button');
        truthButton.classList.add('option-button');
        truthButton.textContent = 'Truth';
        truthButton.addEventListener('click', handleTruth);
        quizOptions.appendChild(truthButton);

        const dareButton = document.createElement('button');
        dareButton.classList.add('option-button');
        dareButton.textContent = 'Dare';
        dareButton.addEventListener('click', handleDare);
        quizOptions.appendChild(dareButton);
    };

    const handleTruth = () => {
        const truthQuestion = {
            key: 'truth',
            question: "What is your biggest regret?",
            placeholder: "Something you wish you'd done differently..."
        };

        quizQuestion.textContent = truthQuestion.question;
        quizOptions.innerHTML = '';
        quizInputContainer.innerHTML = '';
        
        quizOptions.style.display = 'none';
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'text-answer-input';
        input.placeholder = truthQuestion.placeholder;
        quizInputContainer.appendChild(input);

        nextQuestionButton.textContent = 'Finish';
        nextQuestionButton.style.display = 'inline-block';
        
        const onFinish = () => {
            const answer = input.value.trim();
            if (!answer) {
                alert("Please write something!");
                return;
            }
            gameState.answers[truthQuestion.key] = answer;
            input.removeEventListener('keypress', onEnter);
            nextQuestionButton.onclick = null;
            startTruthOrDare();
        };

        const onEnter = (e) => {
            if (e.key === 'Enter') {
                onFinish();
            }
        };
        
        nextQuestionButton.onclick = onFinish;
        input.addEventListener('keypress', onEnter);
        input.focus();
    };

    const handleDare = () => {
        quizContainer.classList.remove('on-screen');
        quizContainer.addEventListener('transitionend', () => {
            quizContainer.style.display = 'none';
            startDareChallenge();
        }, { once: true });
    };

    const startDareChallenge = () => {
        const dareContainer = document.getElementById('dare-container');
        dareContainer.style.display = 'block';
        setTimeout(() => dareContainer.classList.add('on-screen'), 50);

        dareContainer.innerHTML = `
            <div class="dare-overlay"></div>
            <p class="dare-instruction">Find the button and click it!</p>
        `;
        
        const dareButton = document.createElement('button');
        dareButton.textContent = "I did it.";
        dareButton.classList.add('dare-button');
        
        // Random position
        dareButton.style.position = 'absolute';
        dareButton.style.top = `${Math.random() * 80 + 10}%`; // Avoid edges
        dareButton.style.left = `${Math.random() * 80 + 10}%`;

        dareButton.addEventListener('click', () => {
            gameState.answers.dareCompleted = true;
            dareContainer.innerHTML = ''; // Clean up
            dareContainer.classList.remove('on-screen');
            // We need to wait for the transition to finish before hiding it.
            dareContainer.addEventListener('transitionend', () => {
                 dareContainer.style.display = 'none';
                 startDressUpGame();
            }, { once: true });
           
        }, { once: true });

        dareContainer.appendChild(dareButton);
    };

    const startDressUpGame = () => {
        // Transition from the previous container (quiz or dare)
        const activeContainer = document.querySelector('.quiz-container.on-screen, .dare-container.on-screen');
        if (activeContainer) {
            activeContainer.classList.remove('on-screen');
            activeContainer.addEventListener('transitionend', () => {
                activeContainer.style.display = 'none';
                setupDressUpInterface();
            }, { once: true });
        } else {
            setupDressUpInterface();
        }
    };

    const setupDressUpInterface = () => {
        dressUpContainer.style.display = 'flex';
        setTimeout(() => dressUpContainer.classList.add('on-screen'), 50);

        dressUpContainer.innerHTML = `
            <div id="dress-up-main">
                <div id="orb-area">
                    <div id="orb-svg-container">
                        <svg id="orb-base" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="black" /></svg>
                        <svg id="orb-hat" viewBox="0 0 100 100"></svg>
                        <svg id="orb-eyes" viewBox="0 0 100 100"></svg>
                        <svg id="orb-mouth" viewBox="0 0 100 100"></svg>
                    </div>
                </div>
                <div id="accessory-panel"></div>
            </div>
            <button id="finish-dressing-button" class="play-button">Done!</button>
        `;

        const accessoryPanel = document.getElementById('accessory-panel');

        const accessories = {
            Hats: {
                target: 'orb-hat',
                items: {
                    'Top Hat': `<path d="M20 50 C20 40, 80 40, 80 50 L 75 50 L 75 20 L 25 20 L 25 50 Z" fill="black" stroke="white" stroke-width="1"/>`,
                    'Propeller': `<path d="M50 20 L 50 10" stroke="black" stroke-width="2"/><path d="M30 10 L 70 10" stroke="red" stroke-width="3" />`,
                    'Crown': `<path d="M20 40 L 80 40 L 80 30 L 65 35 L 50 25 L 35 35 L 20 30 Z" fill="gold" stroke="black" stroke-width="1"/>`,
                    'None': ''
                }
            },
            Eyes: {
                target: 'orb-eyes',
                items: {
                    'Normal': `<circle cx="35" cy="50" r="5" fill="white" /><circle cx="65" cy="50" r="5" fill="white" /><circle cx="36" cy="50" r="2" fill="black" /><circle cx="66"cy="50" r="2" fill="black" />`,
                    'Angry': `<path d="M25 55 L 45 45" stroke="white" stroke-width="4"/><path d="M55 45 L 75 55" stroke="white" stroke-width="4"/>`,
                    'X Eyes': `<path d="M30 45 L 40 55 M40 45 L 30 55" stroke="white" stroke-width="3"/><path d="M60 45 L 70 55 M70 45 L 60 55" stroke="white" stroke-width="3"/>`,
                    'None': ''
                }
            },
            Mouths: {
                target: 'orb-mouth',
                items: {
                    'Smile': `<path d="M40 70 Q 50 80, 60 70" stroke="white" stroke-width="3" fill="none"/>`,
                    'Frown': `<path d="M40 75 Q 50 65, 60 75" stroke="white" stroke-width="3" fill="none"/>`,
                    'Gasp': `<circle cx="50" cy="75" r="8" fill="white"/>`,
                    'None': ''
                }
            }
        };

        for (const categoryName in accessories) {
            const category = accessories[categoryName];
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'accessory-category';
            categoryDiv.innerHTML = `<h3>${categoryName}</h3>`;

            const gridDiv = document.createElement('div');
            gridDiv.className = 'accessory-grid';
            
            for (const itemName in category.items) {
                const button = document.createElement('button');
                button.className = 'accessory-button';
                button.innerHTML = `<svg viewBox="0 0 100 100">${category.items[itemName]}</svg>`;
                button.title = itemName;
                button.onclick = () => {
                    document.getElementById(category.target).innerHTML = category.items[itemName];
                };
                gridDiv.appendChild(button);
            }
            categoryDiv.appendChild(gridDiv);
            accessoryPanel.appendChild(categoryDiv);
        }

        document.getElementById('finish-dressing-button').addEventListener('click', () => {
            // Here you could save the orb's appearance if you wanted
            gameState.answers.orbDressed = true;
            showStorySummary();
        }, {once: true});
    };
});