/* jshint undef: true */
/* globals
 sendChat,
 randomInteger,
 _,
 on
 */

var Critical = (function()
{
	'use strict';

	const criticalHit =
	[
		{low: 1,  high: 2,  result: "Setback", slash: "Double damage, and the target is blinded until the end of its next turn.", pierce: "Maximum damage.", blunt: "Double damage.", magic: "Maximum damage, and an additional target within range is affected at half potency, or the spell’s area of effect is increased by 5 ft."},
		{low: 3,  high: 4,   result: "Setback", slash: "Maximum damage, and the target must make a DC 12 Wisdom saving throw. On a failed save, the target is frightened of you until the end of its next turn.", pierce: "Double damage, and the target must make a DC 12 Dexterity saving throw. On a failed save, the target loses an eye.", blunt: "Maximum damage.", magic: "Double damage."},
		{low: 5,  high: 6,  result: "Setback", slash: "Double damage", pierce: "Maximum damage, and the target cannot speak for 1d4 rounds.", blunt: "Double damage, and the target must make a DC 12 Constitution saving throw. On a failed save, the target is knocked unconscious.", magic: "Maximum Damage."},
		{low: 7,  high: 8,  result: "Setback", slash: "Maximum Damage", pierce: "Double damage.", blunt: "Maximum damage, and the target must make a DC 12 Constitution saving throw. On a failed save, the target is stunned.", magic: "Double damage, and the target must make a DC 12 saving throw using its spellcasting ability. On a failed save, the target is unable to cast spells on its next turn."},
		{low: 9,  high: 10,  result: "Setback", slash: "Double damage, and the target must make a DC 12 Constitution saving throw. On a failed save, the target cannot take reactions until the end of your next turn.", pierce: "Maximum damage", blunt: "Double damage.", magic: "Maximum damage, and the target has disadvantage on saving throws against your spells for 1d4 rounds."},
		{low: 11,  high: 12,  result: "Setback", slash: "Maximum damage, and you may make another attack against the same target.", pierce: "Double damage and, if this was a melee attack, you can make a DC 16 Strength (Athletics) check to increase this to triple damage.", blunt: "Maximum damage.", magic: "Double damage."},
		{low: 13,  high: 14,  result: "Setback", slash: "Double damage", pierce: "Maximum damage, and you may make another attack with disadvantage against the same target", blunt: "Double damage, and the target must make a DC 12 constitution saving throw. On a failed save, the target has disadvantage on saving throws until the end of their next turn", magic: "Maximum damage."},
		{low: 15,  high: 16,  result: "Setback", slash: "Maximum damage.", pierce: "Double damage.", blunt: "Maximum damage, and the target mus make a DC 12 Constitution saving throw. On a failed save, the target is pushed back 5 ft.", magic: "Double damage, and all enemies that can see you must make a DC 12 Wisdom saving throw. On a failed save, they are frightened of you until the end of your next turn."},
		{low: 17,  high: 18,  result: "Setback", slash: "Double damage, and the target’s speed is reduced by 1/2 until the end of the target’s next turn.", pierce: "Maximum damage.", blunt: "Double damage.", magic: "Maximum damage, and you can immediately cast the same spell against the same target, expending a spell slot as normal."},
		{low: 19,  high: 20,  result: "Setback", slash: "Maximum damage, and the target must make a DC 12 Dexterity saving throw. On a failed save, the target is knocked prone.", pierce: "Double damage, and the target is pinned to the ground and becomes restrained", blunt: "Maximum damage.", magic: "Double damage."},
		{low: 21,  high: 22,  result: "Setback", slash: "Double damage", pierce: "Maximum damage, and any enemy of the target within range may make an attack of opportunity with disadvantage against it.", blunt: "Double damage, and the target must make a DC 12 Constitution saving throw. On a failed save, the target is knocked prone.", magic: "Maximum damage."},
		{low: 23,  high: 24,  result: "Setback", slash: "Maximum damage.", pierce: "Double damage.", blunt: "Maximum damage, and the target’s AC is reduced by 1d4 until the end of its next turn", magic: "Double damage. If this attack deals force or thunder damage: the target is pushed back 1d4 × 5 ft. if it is Large or smaller, taking 1d6 bludgeoning damage for every 5 ft. traveled."},
		{low: 25,  high: 26,  result: "Setback", slash: "Double damage, and the target must make a DC 12 Constitution saving throw. On a failed save, the target can make one less attack on their next turn.", pierce: "Maximum damage.", blunt: "Double damage.", magic: "Maximum damage and, if the target is resistant to this damage type, it loses that resistance for 1 minute."},
		{low: 27,  high: 28,  result: "Setback", slash: "Maximum damage, and you and the target must make a contested Strength check. If the target loses, their weapon is partially broken and deals 1/2 damage until it is repaired.", pierce: "Double damage, and the target must make a DC 12 Constitution saving throw. On a failed save, the target has disadvantage on their next attack", blunt: "Maximum amage.", magic: "Double damage."},
		{low: 29,  high: 30,  result: "Setback", slash: "Double damage", pierce: "Maximum damage, and you have advantage on your next attack against the target", blunt: "Double damage, and the target must make a DC 12 Strength or Dexterity saving throw. On a failed save, the target drops what they are holding.", magic: "Maximum Damage."},
		{low: 31,  high: 32,  result: "Setback", slash: "Maximum damage", pierce: "Double damage.", blunt: "Maximum damage, and the target must make a DC 12 Constitution saving throw. On a failed save, the target has disadvantage on its next melee attack.", magic: "Double damage and a non-magical item the target is holding or wearing is also affected by the damage type of the spell."},
		{low: 33,  high: 34,  result: "Dangerous", slash: "Triple damage and the target is blinden for 1d4 + 1 rounds.", pierce: "Maximum Damage, and roll the damage dice.", blunt: "Triple damage.", magic: "Maximum damage, and 2 additional targets within range are affected at half potency, or the spells area of effect is increased by 10 ft."},
		{low: 35,  high: 36,  result: "Dangerous", slash: "Maximum damage, and the target must make a DC 14 Wisdom saving throw. On a failed save, the target is frightened of you for 2d4 rounds.", pierce: "Triple damage, and the target must make a DC 14 Dexterity saving throw. On a failed save, the target loses an eye.", blunt: "Maximum damage, and roll the damage dice.", magic: "Triple Damage."},
		{low: 37,  high: 38,  result: "Dangerous", slash: "Triple damage.", pierce: "Maximum damage and the target cannot speak for 2d4 rounds.", blunt: "Triple damage, and the target must make a DC 14 Constitution saving throw. On a failed save, the target is knocked unconscious.", magic: "Maximum damage, and roll the damage dice."},
		{low: 39,  high: 40,  result: "Dangerous", slash: "Maximum damage, and roll the damage dice", pierce: "Triple damage", blunt: "Maximum damage, and the target must make a DC 14 Constitution saving throw. On a failed save, the target is stunned.", magic: "Triple damage, and the target must make a DC 14 saving throw using it's spellcasting ability. On a failed save the target is unable to cast spells for 1d4 + 1 rounds."},
		{low: 41,  high: 42,  result: "Dangerous", slash: "Triple damage, and the target must make a DC 14 saving throw. On a failed save, the target cannot take reactions for 2d4 rounds.", pierce: "Maximum damage and roll the damage dice.", blunt: "Triple damage.", magic: "Maximum damage, and the target has disadvantage on saving throws against your spells for 2d4 rounds."},
		{low: 43,  high: 44,  result: "Dangerous", slash: "Maximum damage, and you may make another attack with advantage against the same target.", pierce: "Triple damage and, if this was a melee attack, you can make a DC 14 Strenght (Athletics) check to increase this to Quadruple damage.", blunt: "Maximum damage, and roll the damage dice.", magic: "Triple damage."},
		{low: 45,  high: 46,  result: "Dangerous", slash: "Triple damage.", pierce: "Maximum damage, and you may make another attack against the same target.", blunt: "Triple damage, and the target must make a DC 14 Constitution saving throw. On a failed save, the target has disadvantage on saving throws for 1d4 + 1 rounds", magic: "Maximum damage, and roll the damage dice again."},
		{low: 47,  high: 48,  result: "Dangerous", slash: "Maximum damage, and roll the damage dice again", pierce: "Triple damage.", blunt: "Maximum damage, and the target must make a DC 14 Constitution saving throw. On a failed save, the target is pushed back 10ft.", magic: "Triple damage, and all enemies that can see you must make a DC 14 Wisdom saving throw. On a failed save they are frightened of you for 1d4 + 1 round"},
		{low: 49,  high: 50,  result: "Dangerous", slash: "Triple damage, and the target's speed is reduce to 5ft. until the end of the target's next turn", pierce: "Maximum damage, and roll the damage dice.", blunt: "Triple damage.", magic: "Maximum damage, and you can immediately cast the same spell against any target within range, expending a spell slot as normal."},
		{low: 51,  high: 52,  result: "Dangerous", slash: "Maximum damage, and the target must make a DC 14 Dexterity saving throw. On a failed save, the target is knocked prone", pierce: "Triple damage, and the target is pinned to the ground and becomes restrained.", blunt: "Maximum damage, and roll the damage dice.", magic: "Triple damage."},
		{low: 53,  high: 54,  result: "Dangerous", slash: "Triple damage.", pierce: "Triple damage.", blunt: "Triple damage, and the target must make a DC 14 Constitution saving throw. On a failed save, the target is knocked prone.", magic: "Maximum damage, and roll the damage dice again."},
		{low: 55,  high: 56,  result: "Dangerous", slash: "Maximum damage, and roll the damage dice.", pierce: "Triple damage.", blunt: "Maximum damage, and the targets AC is reduce by 2d4 until the end of it's next turn.", magic: "Triple damage, if this attack deals force or thunder damage: the target is pushed back 2d4 x 5 ft. if it's Large or Smaller, taking 1d6 bludgeoning damage for every 5ft. traveled."},
		{low: 57,  high: 58,  result: "Dangerous", slash: "Triple damage, and the target must make a DC 14 Constitution saving throw. On a failed save, the target can make two fewer attacks on their next turn.", pierce: "Maximum damage, and roll the damage dice again.", blunt: "Triple damage", magic: "Maximum damage and, if the target is resistant to this dmaage type it loses that resisitance for 1 minute. If the target isn't resistant it becomes vulnerable to this damage type for 1 minute."},
		{low: 59,  high: 60,  result: "Dangerous", slash: "Maximum damage, and you and the target must make a contested Strenght check. If the target loses, their weapon is partially broken and deals 1/4 damage until it is repaired.", pierce: "Triple damage, and the target must make a DC 14 Constitution saving throw. On a failed save, the target has disadvantage on attacks for 1d4 + 1 rounds.", blunt: "Triple damage, and the target must make a DC 14 Strenght or Dexterity saving throw. On a failed save, the target drops what they are holding.", magic: "Triple damage."},
		{low: 61,  high: 62,  result: "Dangerous", slash: "Maximum damage, and roll the damage dice", pierce: "MAximum damage and roll the damage dice.", blunt: "Maximum damage, and the target must make a DC 14 Constitution saving throw. On a failed save the target has disadvantage on attacks for 1d4 +1 rounds.", magic: "Triple damage, and two non-magical items the target is holding or wearing are also affected by the damage type of the spell."},
		{low: 63,  high: 64,  result: "Life-Threatening", slash: "Quadruple damage, and the target is blinded for 3d4 + 2 rounds.", pierce: "Maximum double damage.", blunt: "Quadruple damage.", magic: "Maximum damage, and 3 additional targets within range are affected at half potency, or the spells area of effect is increased by 15ft."},
		{low: 65,  high: 66,  result: "Life-Threatening", slash: "Maximum damage, and the target must make a DC 16 Wisdom saving throw. On a failed save, the target is frightened of you for 3d4 rounds.", pierce: "Quadruple damage, and the target must make a DC 16 Dexterity saving throw. On a failed save, the target loses an eye.", blunt: "Maximum double damage.", magic: "Quadruple damage."},
		{low: 67,  high: 68,  result: "Life-Threatening", slash: "Quadruple damage", pierce: "Maximum damage, and the target cannot speak for 3d4 rounds.", blunt: "Quadruple damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target is knocked unconscious.", magic: "Maximum double damage."},
		{low: 69,  high: 70,  result: "Life-Threatening", slash: "Maximum double damage.", pierce: "Quadruple damage.", blunt: "Maximum damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target is stunned.", magic: "Quadruple damage, and the target must make a DC 16 Saving throw using it's spellcasting ability. On a failed save, the target is unable to cast spells for 3d4 rounds."},
		{low: 71,  high: 72,  result: "Life-Threatening", slash: "Quadruple damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target cannot take reactions for 3d4 rounds.", pierce: "Maximum double damage.", blunt: "Quadruple damage.", magic: "Maximum damage, and the target has disadvantage on saving throws against your spells for 3d4 rounds."},
		{low: 73,  high: 74,  result: "Life-Threatening", slash: "Maximum Damage, and you may make another attack.", pierce: "Quadruple damage and, if this was melee attack, you can make a DC 16 Strenght (Athletics) check to increase this to quintuple damage.", blunt: "Maximum double damage.", magic: "Quadruple damage."},
		{low: 75,  high: 76,  result: "Life-Threatening", slash: "Quadruple damage.", pierce: "Maximum damage and you may make another attack with advantage against the same target.", blunt: "Quadruple damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target has disadvantage on saving throws for 2d4 + 2 rounds.", magic: "Maximum double damage."},
		{low: 77,  high: 78,  result: "Life-Threatening", slash: "Maximum double damage.", pierce: "Quadruple damage.", blunt: "Maximum damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target is pushed back 15 ft.", magic: "Quadruple damage, and all enemies that can see you must make a DC 16 Wisdom saving throw. On a failed save, they are frightened of you for 2d4 + 2 rounds"},		
		{low: 79,  high: 80,  result: "Life-Threatening", slash: "Quadruple damage, and the target’s speed is reduced to 0 ft. until the end of the targets next turn.", pierce: "Maximum double damage.", blunt: "Quadruple damage.", magic: "Maximum damage, and you can immediately cast the same spell against any target within range. This second attack does not expend a spell slot."},
		{low: 81,  high: 82,  result: "Life-Threatening", slash: "Maximum damage, and the target must make a DC 16 Dexterity saving throw. On a failed save, the target is knocked prone.", pierce: "Quadruple damage, and the target is pinned to the ground and becomes restrained.", blunt: "Maximum double damage.", magic: "Quadruple damage."},
		{low: 83,  high: 84,  result: "Life-Threatening", slash: "Quadruple damage.", pierce: "Quadruple damage, and the target is pinned to the ground and becomes restrained.", blunt: "Maximum double damage.", magic: "Quadruple damage."},
		{low: 85,  high: 86,  result: "Life-Threatening", slash: "Maximum double damage.", pierce: "Quadruple damage.", blunt: "Maximum damage, and the target's AC is reduced by 3d4 until the end of its next turn.", magic: "Quadruple damage. If this attack deals force or thunder damage: the target is pushed back 3d4 x 5 ft. if it's Large or smaller, taking 1d6 bludgeoning damage for every 5ft. traveled."},
		{low: 87,  high: 88,  result: "Life-Threatening", slash: "Quadruple damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target can make three fewer attacks on their next turn.", pierce: "Maximum double damage.", blunt: "Quadruple damage.", magic: "Maximum damage, and the target becomes vulnerable to this damage type for 1 minute."},
		{low: 89,  high: 90,  result: "Life-Threatening", slash: "Maximum damage, and you and the target must make a contested Strenght check. If the target loses their weapon is broken.", pierce: "Quadruple damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target has disadvantage on attacks for 2d4 + 2 rounds.", blunt: "Maximum damage, and the target must make a DC 16 Constitution saving throw. On a failed save, the target has disadvantage on attacks for 2d4 + 2 rounds.", magic: "Quadruple damage."},
		{low: 91,  high: 92,  result: "Life-Threatening", slash: "Quadruple damage", pierce: "Maximum damage, and you have advantage on attacks against the target for 2d4+2 rounds.", blunt: "Quadruple damage, and the target must make a DC 16 Strenght or Dexterity saving throw. On a failed save, the target drops what they are holding", magic: "Quadruple damage, and three items the target is holding or wearing are also affected by the damage type of the spell"},
		{low: 93,  high: 94,  result: "Deadly", slash: "Quadruple damage and, if the damage the target takes is equal to or greater than 1/2 of their maximum hit points, they are decapitated.", pierce: "Quadruple damage, and the target must make a DC 18 Constitution saving throw. On a failed save, the target is paralyzed.", blunt: "Quadruple and, if the damage the target takes is equal to or greater than 1/4 maximum hit points, it is knocked unconscious.", magic: "Quadruple damage, and you regain a spell slot. Roll a d6 to determine the level of the spell slot."},
		{low: 95,  high: 96,  result: "Deadly", slash: "Quadruple damage, and if the damage the target takes is equal to or greater than 1/2 of their maximum hit points, they are disemboweled.", pierce: "Quadruple damage and the target loses 1/4 of their maximum hit points at the beginning of their turn for 3 rounds.", blunt: "Quadruple damage, and the target becomes vulnerable to bludgeoning damage for 1 minute.", magic: "Quadruple damage, and all creatures withing 15 ft. of the target are also affected."},
		{low: 97,  high: 98,  result: "Deadly", slash: "Quadruple damage and, if the damage the target takes is equal to or greater than 1/4 of their maximum hit points, they lose a leg.", pierce: "Quadruple damage, and the target becomes vulnerable to piercing damage for 1 minute.", blunt: "Quadruple damage, and the target's speed is reduced by 1/2. Additionally, for every 5 ft. the target moves, it takes 1d6 damage.", magic: "Quadruple damage, and the target must make a DC 18 Wisdom saving throw. On a failed save, the target is unable to see you for 1 minute."},
		{low: 99,  high: 100,  result: "Deadly", slash: "Quadruple damage and, if the damage the target takes is equal to or greater than 1/2 of their maximum hit points, they lose an arm/hand.", pierce: "Quadruple damage, and the target has disadvantage on attacks until the end of the encounter.", blunt: "Quadruple damage, and the target loses use of one of it's arms or hands.", magic: "Quadruple damage, and all enemies that can see you must make a DC 18 Wisdom saving throw. On a failed save, they are frightened of you, until they succeed on the save"},

	];

	function registerEventHandlers()
	{
		on('chat:message', Critical.handleChatMessage);
	}

	/**
	 * Grab chat message objects
	 *
	 * @param {object} msg
	 */
	function handleChatMessage(msg)
	{

		// Check if we are dealing with a !critical command.
		if (msg.type === "api" && msg.content.indexOf("!critical") !== -1)
		{
			var content = msg.content;
			var words = content.split(' ');

			// Sanity check
			if (words.length > 0)
			{
				// Sanity check
				if (words[0] === '!critical')
				{
					var rolled = 0;

					// Was a roll amount given? If so parse the second "word" as an int, otherwise create a randomInteger.
					if (words.length === 2)
					{
						rolled = parseInt(words[1]);
					}
					else
					{
						rolled = randomInteger(100);
					}

					// Sanity check
					if (typeof rolled !== 'number' || rolled === 0)
					{
						rolled = randomInteger(100);
					}

					// Get the smack object as a smash variable
					var smash = Critical._determineCritical(rolled);

					// Sanity check
					if (smash)
					{
						// Send the critical result as a formatted string in chat
						sendChat('Critical Hit', rolled.toString() + "% <b>" + smash.result + "</b><br><i><b>Slash: </b>" + smash.slash + "</b><br><i><b>Magical: </b>" + smash.magic + '</i><br><i><b>Blunt: </b>' + smash.blunt + '</i><br><i><b>Pierce: </b>' + smash.pierce + '</i>');
					}
					else
					{
						sendChat('Critical Hit', 'Invalid % roll given, or something went wrong. GM makes something up.');
					}
				}
			}
		}
	}

	/**
	 * Internal function given the roll value returns the object indicating the result and effect.
	 *
	 * @param {int} roll
	 * @return {object} smack
	 * @private
	 */
	function _determineCritical(roll)
	{
		// Use _.find to figure out what happened.
		return _.find(criticalHit, function (hit)
		{
			return (roll >= hit.low && roll <= hit.high);
		});
	}

	return {
		registerEventHandlers: registerEventHandlers,
		handleChatMessage: handleChatMessage,
		_determineCritical: _determineCritical
		}
}());

/**
 * Fires when the page has loaded.
 */
on("ready", function()
{
	Critical.registerEventHandlers();
});
