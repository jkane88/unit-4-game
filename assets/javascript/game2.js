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

var sound_jerry = new Audio('assets/audio/jerryNice.mp3');
var sound_morty = new Audio('assets/audio/ohjeez.mp3');
var sound_theme = new Audio('assets/audio/rickandmortytheme.mp3');
var sound_rick = new Audio('assets/audio/rickWub.mp3');
var sound_game = new Audio('assets/audio/showmewhatyougot.mp3');
var sound_summer = new Audio('assets/audio/summerBooYa.mp3');

// Character class
class Character {
    constructor(name, keyword, health, damage, counter, bonus, sound, image) {
        this.name = name;
        this.keyword = keyword;
        this.health = health;
        this.damage = damage;
        this.counter = counter;
        this.bonus = bonus;
        this.sound = sound;
        this.image = 'assets/images/' + name + '.jpg';
    }
}

// Create new characters & add them to the characters array
var charSummer = new Character('Summer', 'summer', 120, 10, 15, 10, sound_summer);
var charJerry = new Character('Jerry', 'jerry', 100, 18, 5, 18, sound_jerry);
var charMorty = new Character('Morty', 'morty', 150, 7, 20, 7, sound_morty);
var charRick = new Character('Rick', 'rick', 180, 5, 25, 5, sound_rick);
var characters = [charSummer, charJerry, charMorty, charRick];
// Randomize character order
characters.sort(function (a, b) { return 0.5 - Math.random() });

// Hide player & defender slots, attack-btn and restart-btn
$('#restart-btn, #game').hide();

addStarterChars();

// Player and defender selection
$(document).on('click', '.charCard', function () {

    // Set defender
    if (player != null && defender == null) {
        defenderCard = $(this);
        defender = defenderCard.data();
        defender.sound.play();
        $('#defender-slot').append(defenderCard);
    }

    // Set player
    if (player == null) {
        playerCard = $(this);
        player = playerCard.data();
        player.sound.play();
        $('#player-slot').append(playerCard);
        $('#game').show();

        sound_theme.play();
    }
});

// On attack clicked...
$(document).on('click', '#attack-btn', function () {

    // Player's turn
    defender.health -= player.damage;
    updateCard(defenderCard, defender);
    $('#text1').text('You attacked ' + defender.name + ' for ' + player.damage + ' damage.');

    // If defender is still alive
    if (defender.health > 0) {

        // Defender's turn
        player.health -= defender.counter;
        updateCard(playerCard, player);
        $('#text2').text(defender.name + ' attacked you for ' + defender.counter + ' damage.');


        // If player is still alive
        if (player.health > 0) {
            player.damage += player.bonus;
        } else {
            playerCard.remove();
            $('#attack-btn').hide();
            $('#restart-btn').show();
            alert('Yer dead');
        }
        // remove dead defender card        
    } else {
        alert(defender.name + ' died.');
        defenderCard.remove();

        for (var i = 0; i < characters.length; i++) {
            if (characters[i].keyword === defender.keyword) {
                characters.splice(i, 1);
            }
        }
        // select new defender        
        defender = null;

        if (characters.length === 1) {
            $('#restart-btn').show();
            $('#attack-btn').hide();
            alert('Wubalubadubdub');
        }
    }

    function updateCard(characterCard, character) {
        $(characterCard).find('.charHealth').text(character.health);
    }

});

$(document).on('click', '#restart-btn', function () {
    location.reload();
});


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

    card.data(Character);

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