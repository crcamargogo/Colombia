import confetti from 'confetti';

const groupMapping = {
    "Facilitador": [
        "LOPEZ ESTRADA MIGUEL JOSE", 
        "RAMIREZ MONSERRAT MARTIN ALEJANDRO", 
        "PILAR", 
        "RODRIGUEZ DEIBY ALEXANDER",
        "BARON VASQUEZ DIEGO FERNANDO"
    ],
    "1": [
        "GRILLO MARTINEZ JUAN JOSE",
        "RUBIO GIRON KAROL TATIANA", 
        "CONTRERAS MARTINEZ WILBER ENRIQUE",
        "ADAMES PRADA GABRIEL ARTURO",
        "PERDOMO QUEVEDO DIANA PAOLA"
    ],
    "2": [
        "GARCIA ARIZA JOHN PEDRO",
        "BLANCO SAYAGO EDINSON JAVIER", 
        "ROA PUENTES HENRY YAMIL",
        "ANGARITA AGUDELO LAURA LORENA",
        "SANDOVAL GALVIS JUANA CAROLINA"
    ],
    "3": [
        "MELO ARIAS JORGE ALEJANDRO",
        "VIVAS MOLINA CINDY JANETH", 
        "PEREZ GONZALEZ RUBIO KATHIA MILENA",
        "ORBEGOZO CONTRERAS DAMIAN",
        "RESTREPO CUBILLOS NICOLAS"
    ],
    "4": [
        "RUBIO GOMEZ JAIME ALBERTO",
        "HERRERA RIAÑO ALVARO EMYIR", 
        "RAMIREZ HENAO JOHN ALEXANDER",
        "MOSQUERA SOTO SANDRA MILENA",
        "DURAN GONZALEZ NILSON ADRIAN"
    ],
    "5": [
        "CACERES DIANA PATRICIA",
        "ESPITIA SANCHEZ WILFRED MAURICIO", 
        "SUAREZ JAVIER LEANDRO",
        "ROJAS AMORTEGUI JUAN MIGUEL",
        "GARCIA TORRES NIDIA FARID"
    ],
    "6": [
        "MORENO DUARTE RANDY ARIAN",
        "PARGA RAMIREZ DIANA PAOLA", 
        "HOYOS ARENAS ANDREA DEL PILAR",
        "CIFUENTES GARZON CESAR AUGUSTO",
        "JUNCO LUZ AYDEE"
    ],
    "7": [
        "GARAVITO MUÑOZ CHRISTIAN ANDRES",
        "LLANOS SANDOVAL ARNOLD ANTONIO", 
        "HERNANDEZ RUIZ GRACE PAOLA",
        "ROJAS SUAREZ MARIO FERNANDO",
        "SANTAMARIA ECHEVERRY GUSTAVO ADOLFO"
    ]
};


const completedParticipants = new Set();
const participantMoods = new Map();

function initGroupAssignment() {
    const participantsGrid = document.getElementById('participantsGrid');
    
    const welcomeTooltip = document.createElement('div');
    welcomeTooltip.classList.add('space-tooltip', 'welcome-tooltip');
    welcomeTooltip.innerHTML = `
        <div class="tooltip-content">
            <div class="tooltip-icon">🚀</div>
            <h3>¡Bienvenido Explorador Espacial!</h3>
            <p>Selecciona tu avatar para descubrir tu misión y equipo asignado</p>
            <button class="tooltip-btn">¡Entendido!</button>
        </div>
    `;
    document.body.appendChild(welcomeTooltip);

    setTimeout(() => {
        welcomeTooltip.classList.add('visible');
    }, 500);

    welcomeTooltip.querySelector('.tooltip-btn').addEventListener('click', () => {
        welcomeTooltip.classList.remove('visible');
        setTimeout(() => welcomeTooltip.remove(), 300);
    });

    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Buscar participante..." class="search-input">
            <button id="voiceSearchBtn" class="voice-btn">
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                </svg>
            </button>
        </div>
        <div id="searchStatus" class="search-status"></div>
    `;
    participantsGrid.parentElement.insertBefore(searchContainer, participantsGrid);

    const searchInput = document.getElementById('searchInput');
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const searchStatus = document.getElementById('searchStatus');

    function searchAndHighlight(searchTerm) {
        const participantCards = document.querySelectorAll('.participant-card');
        const normalizedSearch = searchTerm.toLowerCase().trim();
        let found = false;

        participantCards.forEach(card => {
            const name = card.querySelector('.name').textContent.toLowerCase();
            card.classList.remove('highlighted');
            card.style.display = 'flex'; // Reset display first
            
            if (normalizedSearch === '') {
                card.style.display = 'flex';
            } else if (name.includes(normalizedSearch)) {
                card.style.display = 'flex';
                card.classList.add('highlighted');
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (name === normalizedSearch) {
                    setTimeout(() => card.click(), 1000);
                }
                found = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (!found && searchTerm) {
            searchStatus.textContent = `No se encontró el participante "${searchTerm}"`;
            searchStatus.classList.add('error');
        } else {
            searchStatus.textContent = '';
            searchStatus.classList.remove('error');
        }
    }

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        searchAndHighlight(searchTerm);
    });

    voiceSearchBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.lang = 'es-ES';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                searchStatus.textContent = 'Escuchando...';
                searchStatus.classList.add('listening');
                voiceSearchBtn.classList.add('active');
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                searchInput.value = transcript;
                searchAndHighlight(transcript);
            };

            recognition.onerror = (event) => {
                searchStatus.textContent = 'Error en el reconocimiento de voz. Intente de nuevo.';
                searchStatus.classList.add('error');
                voiceSearchBtn.classList.remove('active');
            };

            recognition.onend = () => {
                searchStatus.classList.remove('listening');
                voiceSearchBtn.classList.remove('active');
            };

            recognition.start();
        } else {
            searchStatus.textContent = 'El reconocimiento de voz no está soportado en este navegador.';
            searchStatus.classList.add('error');
        }
    });

    const moodEmojis = {
        'happy': '😊',
        'normal': '😐',
        'sad': '😔'
    };

    function showGroupAssignment(participant, group) {
        const modal = document.createElement('div');
        modal.classList.add('group-assignment-modal');
        
        const groupMembers = groupMapping[group];
        const membersList = groupMembers
            .map(member => `<div class="group-member">${member}</div>`)
            .join('');
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2>INICIANDO PROTOCOLO DE ASIGNACIÓN</h2>
                <div class="loading-text">Verificando credenciales...</div>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
                <div class="status-text">Acceso autorizado</div>
                <p class="selected-participant">${participant}</p>
                <div class="members-list" style="display: none">
                    <h3>EQUIPO ASIGNADO: ${group === "Facilitador" ? "FACILITADOR" : `GRUPO ${group}`}</h3>
                    ${membersList}
                </div>
                <div class="mood-selection" style="display: none">
                    <h3>¿Cómo te sientes hoy?</h3>
                    <div class="mood-options">
                        <button class="mood-btn" data-mood="happy">😊</button>
                        <button class="mood-btn" data-mood="normal">😐</button>
                        <button class="mood-btn" data-mood="sad">😔</button>
                    </div>
                </div>
                <button class="close-modal" style="display: none">CERRAR TERMINAL</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.querySelector('.progress-bar').style.width = '100%';
            modal.querySelector('.loading-text').textContent = 'Procesando asignación...';
        }, 100);
        
        setTimeout(() => {
            modal.querySelector('.members-list').style.display = 'block';
            modal.querySelector('.mood-selection').style.display = 'block';
            modal.querySelector('.loading-text').style.display = 'none';
            
            const missionTooltip = document.createElement('div');
            missionTooltip.classList.add('space-tooltip', 'mission-tooltip');
            missionTooltip.innerHTML = `
                <div class="tooltip-content">
                    <div class="tooltip-icon">🎯</div>
                    <h3>¡Misión Asignada!</h3>
                    <p>Dirígete a tu grupo asignado para comenzar tu aventura espacial</p>
                    <div class="pulse-arrow">→</div>
                </div>
            `;
            document.body.appendChild(missionTooltip);
            
            setTimeout(() => {
                missionTooltip.classList.add('visible');
            }, 300);
            
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 2000);

        const moodButtons = modal.querySelectorAll('.mood-btn');
        moodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedMood = btn.dataset.mood;
                completedParticipants.add(participant);
                participantMoods.set(participant, selectedMood);
                
                const participantCards = document.querySelectorAll('.participant-card');
                participantCards.forEach(card => {
                    const cardName = card.querySelector('.name').textContent;
                    if (cardName === participant) {
                        card.classList.add('completed');
                    }
                });

                const goodbyeTooltip = document.createElement('div');
                goodbyeTooltip.classList.add('space-tooltip', 'goodbye-tooltip');
                goodbyeTooltip.innerHTML = `
                    <div class="tooltip-content">
                        <div class="tooltip-icon">👋</div>
                        <h3>¡Hasta pronto, Explorador!</h3>
                        <p>Tu estado de ánimo ha sido registrado. ¡Que tengas un excelente viaje!</p>
                        <button class="tooltip-btn">Entendido</button>
                    </div>
                `;
                document.body.appendChild(goodbyeTooltip);
                
                setTimeout(() => {
                    goodbyeTooltip.classList.add('visible');
                }, 300);

                goodbyeTooltip.querySelector('.tooltip-btn').addEventListener('click', () => {
                    goodbyeTooltip.classList.remove('visible');
                    modal.remove();
                    const missionTooltip = document.querySelector('.mission-tooltip');
                    if (missionTooltip) {
                        missionTooltip.classList.remove('visible');
                        setTimeout(() => missionTooltip.remove(), 300);
                    }
                    setTimeout(() => {
                        // Clear search input and reset filter
                        const searchInput = document.getElementById('searchInput');
                        if (searchInput) {
                            searchInput.value = '';
                            searchAndHighlight(''); // Reset the filter
                        }
                        
                        goodbyeTooltip.remove();
                        const welcomeTooltip = document.createElement('div');
                        welcomeTooltip.classList.add('space-tooltip', 'welcome-tooltip');
                        welcomeTooltip.innerHTML = `
                            <div class="tooltip-content">
                                <div class="tooltip-icon">🚀</div>
                                <h3>¡Bienvenido Explorador Espacial!</h3>
                                <p>Selecciona tu avatar para descubrir tu misión y equipo asignado</p>
                                <button class="tooltip-btn">¡Entendido!</button>
                            </div>
                        `;
                        document.body.appendChild(welcomeTooltip);
                        setTimeout(() => {
                            welcomeTooltip.classList.add('visible');
                        }, 300);

                        welcomeTooltip.querySelector('.tooltip-btn').addEventListener('click', () => {
                            welcomeTooltip.classList.remove('visible');
                            setTimeout(() => welcomeTooltip.remove(), 300);
                        });
                    }, 300);
                });
            });
        });
    }

    function createParticipantCards() {
        const allParticipants = Object.values(groupMapping).flat();
        
        const participantGroupMap = new Map();
        Object.entries(groupMapping).forEach(([group, members]) => {
            members.forEach(member => {
                participantGroupMap.set(member, group);
            });
        });
        
        allParticipants.forEach(participant => {
            const participantCard = document.createElement('div');
            participantCard.classList.add('participant-card', 'clickable');
            if (completedParticipants.has(participant)) {
                participantCard.classList.add('completed');
            }
            
            const avatar = createAvatar(participant);
            
            const name = document.createElement('div');
            name.classList.add('name');
            name.textContent = participant;
            
            participantCard.appendChild(avatar);
            participantCard.appendChild(name);
            
            participantCard.addEventListener('click', () => {
                if (!completedParticipants.has(participant)) {
                    const group = participantGroupMap.get(participant);
                    showGroupAssignment(participant, group);
                }
            });
            
            participantsGrid.appendChild(participantCard);
        });
    }

    

    function createAvatar(name) {
        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('avatar');
        avatarContainer.dataset.fullName = name;
    
        // Convertir el nombre a un formato adecuado para el archivo
        const cleanName = name
            .toLowerCase()
            .replace(/,/g, '') // Eliminar comas
            .replace(/\s+/g, '_') // Reemplazar espacios por guiones bajos
            .replace(/[^a-z0-9_]/g, ''); // Quitar caracteres especiales
    
        const imagePath = `avatars/${cleanName}.jpg`;
    
        const avatarImage = document.createElement('img');
        avatarImage.src = imagePath;
        avatarImage.alt = name;
        avatarImage.classList.add('avatar-image');
    
        avatarImage.onerror = () => {
            avatarImage.remove();
            let initials = name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
            avatarContainer.textContent = initials;
        };
    
        avatarContainer.appendChild(avatarImage);
        return avatarContainer;
    }
    
    

    function showMoodsModal() {
        const modal = document.createElement('div');
        modal.classList.add('groups-modal');
        
        let moodsHTML = '<div class="moods-list">';
        
        if (participantMoods.size === 0) {
            moodsHTML += `
                <div class="no-moods">
                    <div class="tooltip-icon">🤔</div>
                    <p>Aún no hay estados de ánimo registrados</p>
                </div>
            `;
        } else {
            Array.from(participantMoods.entries()).forEach(([participant, mood]) => {
                moodsHTML += `
                    <div class="mood-item">
                        <div class="mood-participant">${participant}</div>
                        <div class="mood-emoji">${moodEmojis[mood]}</div>
                    </div>
                `;
            });
        }
        
        moodsHTML += '</div>';
        
        modal.innerHTML = `
            <div class="rocket-modal moods-modal">
                <div class="rocket-lights"></div>
                <h2>ESTADOS DE ÁNIMO</h2>
                ${moodsHTML}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function createViewGroupsButton() {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('floating-buttons');
        
        const groupsButton = document.createElement('button');
        groupsButton.classList.add('view-groups-btn');
        groupsButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
        `;
        groupsButton.addEventListener('click', showAllGroups);
        
        const moodsButton = document.createElement('button');
        moodsButton.classList.add('view-moods-btn');
        moodsButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
        `;
        moodsButton.addEventListener('click', showMoodsModal);
        
        buttonsContainer.appendChild(groupsButton);
        buttonsContainer.appendChild(moodsButton);
        document.body.appendChild(buttonsContainer);
    }

    function showAllGroups() {
        const modal = document.createElement('div');
        modal.classList.add('groups-modal');
        
        let groupsHTML = '<div class="groups-list">';
        
        if (groupMapping["Facilitador"]) {
            groupsHTML += `
                <div class="group-item facilitator-group">
                    <h3>FACILITADOR</h3>
                    <div class="group-members">
                        ${groupMapping["Facilitador"].map(member => `
                            <div class="member-item">${member}</div>
                        `).join('')}
                    </div>
                </div>
                <div class="groups-divider"></div>
            `;
        }
        
        Object.entries(groupMapping).forEach(([group, members]) => {
            if (group !== "Facilitador") {
                groupsHTML += `
                    <div class="group-item">
                        <h3>GRUPO ${group}</h3>
                        <div class="group-members">
                            ${members.map(member => `
                                <div class="member-item">${member}</div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        groupsHTML += '</div>';
        
        modal.innerHTML = `
            <div class="rocket-modal">
                <div class="rocket-lights"></div>
                <h2>TRIPULACIÓN ESPACIAL</h2>
                ${groupsHTML}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    createParticipantCards();

    createViewGroupsButton();
}

document.addEventListener('DOMContentLoaded', () => {
    initGroupAssignment();
});

document.querySelector(".decoration-avatar").addEventListener("mouseenter", function() {
    let bubbleContainer = document.querySelector(".thought-container");
    let video = document.getElementById("thought-video");

    bubbleContainer.style.display = "block"; // Mostrar burbuja
    bubbleContainer.style.animation = "fadeIn 0.3s ease-in-out"; // Agregar animación
    video.play(); // Reproducir video
});

document.querySelector(".decoration-avatar").addEventListener("mouseleave", function() {
    let bubbleContainer = document.querySelector(".thought-container");
    let video = document.getElementById("thought-video");

    video.pause(); // Pausar video
    bubbleContainer.style.display = "block"; // Ocultar burbuja
});

/* Animación de aparición */
document.head.insertAdjacentHTML("beforeend", `
<style>
@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
}
</style>
`);
