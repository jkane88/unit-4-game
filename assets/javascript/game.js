// VARIABLES
var gameState;
var gameStateText = $('#game');
var player;
var defender;
var playerCard;
var defenderCard;
var playerPicked = false;
var defenderPicked = false;
var kills = 0;
var battleTextCase = -1;
var p1 = $('#battle-text-1');
var p2 = $('#battle-text-2');
var p3 = $('#battle-text-3');
var bh = $('#battle-area-header');

// Character class
class Character {
    constructor(name, keyword, health, damage, bonus, image) {
        this.name = name;
        this.keyword = keyword;
        this.health = health;
        this.damage = damage;
        this.bonus = bonus;
        this.image = 'assets/images/' + keyword + '.jpg';
    }
}

// Create new characters & add them to the characters array
var charSummer = new Character('Summer', 'summer', 120, 8, 9);
var charJerry = new Character('Jerry', 'jerry', 100, 5, 12);
var charMorty = new Character('Morty', 'morty', 150, 20, 1);
var charRick = new Character('Rick', 'rick', 160, 25, 0);
var characters = [charSummer, charJerry, charMorty, charRick];
// Randomize character order
characters.sort(function(a,b){return 0.5 - Math.random()});

// Hide player & defender slots, attack-btn and restart-btn
$('#player-card, #defender-card, #attack-btn, #restart-btn').css('visibility', 'hidden');

// Game
$(document).ready(function () {
    // Initialize character cards
    addStarterChars();
    gameState = 1;

    // Pick player and defender
    if (gameState === 1) {

        // Set game state text
        gameStateText.text('Pick your character.');
        p1.text(gameStateText.text());
        bh.text('Staging...');

        // Pick player, card moves to player area;
        $('.charCard').on('click', function () {

            // If an player has not been picked...
            if (!playerPicked) {
                // Set player vars
                player = $(this).data();
                playerCard = $(this);
                playerPicked = true;
                moveChar(playerCard, 4);

                // Add green background to player char name
                $(playerCard).find('.charName').addClass('bg-success text-light');

                // Make player slot visible
                $('#player-card').css('visibility', 'visible');

                // Set action text
                gameStateText.text('Pick the defender.');
                p2.text(gameStateText.text());
                p1.text('You chose ' + player.name + '.');

            }
            // If defender not picked...
            else if (!defenderPicked) {
                // Clear defender card
                $('#defender-card').find('.slot').empty();

                // Set defender vars
                defender = $(this).data();
                defenderCard = $(this);
                defenderPicked = true;
                moveChar(defenderCard, 5);

                // Add red background to defender char name
                $(this).find('.charName').addClass('bg-danger text-light');

                // Show defender slot
                $('#defender-card').css('visibility', 'visible');

                // Update action text
                p2.text(defender.name + ' wants that smoke.');
                p3.text('Attack!');

                // Add red background to remaining chars' names
                for (var i = 0; i < 4; i++) {
                    $('.slot[slot="' + i + '"]').find('.charName').addClass('bg-danger text-light');
                }

                // Set up state 2 (battle)
                gameState = 2;
                gameStateText.text('Attack your opponent.');
                bh.text('Round ' + (kills+1) + ': ' + player.name + ' vs ' + defender.name);

                // Make attack button visible
                $('#attack-btn').css('visibility', 'visible');
            }
        });
    }

    // Battle
    $('#attack-btn').on('click', function () {
        if (gameState === 2) {
            // Variables
            var playerHealthText = $(playerCard).find('.charHealth');
            var defenderHealthText = $(defenderCard).find('.charHealth');

            // Attack defender, reduce their health
            defender.health -= player.damage;
            p3.text('');
            p1.text('You attacked ' + defender.name + ' for ' + player.damage + ' damage.');

            // Check defender's health
            if (defender.health <= 0) {

                // Defender defeated, remove defender card
                // $('#defender-card').find('.slot').empty();
                p2.text(defender.name + ' defeated!');
                p3.text('Pick a new defender.');
                $('#defender-card').find('.card-img-top').attr('src', 'assets/images/' + defender.keyword + '-dead.png');


                // Increase kills, check for available defenders
                if (kills++ < 2) {
                    // Pick new defender, set game state
                    gameState = 1;
                    gameStateText.text('Pick the next defender.');
                    defenderPicked = false;
                } 
                // If all characters defeated
                else {
                    p2.text('All defenders defeated.');
                    p3.text('You win!');
                    $('#restart-btn').css('visibility', 'visible');
                    gameState = 3;
                }

            // If defender is still alive
            } else {
                // Defender attacks player
                player.health -= defender.damage;

                // Check player's health
                if (player.health <= 0) {
                    // player defeated, remove player card
                    // $('#player-card').find('.slot').empty();

                    $('#player-card').find('.card-img-top').attr('src', 'assets/images/' + player.keyword + '-dead.png');
                    $(playerCard).find('.charName').removeClass('bg-success');
                    $(playerCard).find('.charName').addClass('bg-dark');

                    // Game over
                    p1.text(defender.name + ' attacked you for ' + defender.damage + ' damage.');
                    p2.text(defender.name + ' defeated you.');

                    $('#restart-btn').css('visibility', 'visible');

                    gameState = 3;
                }
                // Both player and defender still alive
                else {
                    p2.text(defender.name + ' attacked you for ' + defender.damage + ' damage.');
                    // Increase player damage by bonus amount
                    player.damage += player.bonus;
                    // Player attacks again
                }
            }
            // Update card health
            refreshCards();

            /// Updates text on player/defender cards to show current health
            function refreshCards() {
                playerHealthText.text(player.health);
                defenderHealthText.text(defender.health);
            }
        }
    })

    // Play again
    $('#restart-btn').on('click', function() {
        location.reload(); // refresh page
    });
}); // end doc ready

/// Builds a character card based on the Character passed to it
function createCharCard(Character) {
    // Create card img, body, title
    var card = $('<div>').addClass('card charCard').attr('char', Character.name);
    var cardImg = $('<img>').addClass('card-img-top').attr('src', Character.image);
    var cardBody = $('<div>').addClass('card-body p-0');
    var cardTitle = $('<h6>').addClass('card-text p-2 charName m-0').text(Character.name);

    // Create row / cols
    var cardRow = $('<div>').addClass('row p-2');
    var cardColLeft = $('<div>').addClass('col col-left');
    var cardColRight = $('<div>').addClass('col col-right text-right');

    // Build row
    $(cardRow).append(cardColLeft);
    $(cardRow).append(cardColRight);

    // Create elements for cols
    var cardIconHealth = $('<p>').addClass('fa fa-heart d-block p-1 m-0');
    var cardHealth = $('<p>').addClass('card-text m-0 charHealth').text(Character.health);

    // Build cols
    $(cardColLeft).append(cardIconHealth);
    $(cardColRight).append(cardHealth);

    // Build card-body
    $(cardBody)
        .append(cardTitle)
        .append(cardRow);

    // Attach card-body to card-img
    var completeCard = card.append(cardImg).append(cardBody);

    // Returns everything needed for a complete Bootstrap card
    return completeCard;
}

/// Adds all characters from the characters array into the starting slots
function addStarterChars() {
    $.each(characters, function (index, value) {
        $('.slot[slot=' + index + ']').append(createCharCard(characters[index]));
        $('.slot[slot=' + index + '] > .charCard').data(characters[index]);
    });
}

/// Move given charCard to desired slotNum, slides remaining charCards into previous slots
function moveChar(charCard, slotNum) {
    // Get current slot;
    var currentSlot = parseInt(charCard.parent().attr('slot'));

    // If currentSlot is not the last slot...
    if (currentSlot < 3) {

        // Move charCard
        move(charCard, slotNum);

        // Slide charCards into previous slots
        $('.slot[slot="' + (currentSlot + 1) + '"]')
            .append($('.slot[slot="' + currentSlot + '"]'))

    } else {
        // Move charCard
        move(charCard, slotNum);
    }

    // Move the charCard to specified slot
    function move(charCard, slotNum) {
        // Add charCard ( $(this) ) to slotNum
        $('.slot[slot="' + slotNum + '"]').append(charCard);
        // Remove 'charCard' class, this prevents user from clicking a card once picked
        $(charCard).removeClass('charCard');
    }
}
