let advantage = false // Advantage Flag
let disadvantage = false // Disadvantage Flag
const serverUrl = "https://dice-roller-jmm-node-ckgbgreqdubthdhw.centralus-01.azurewebsites.net" // Url of the Node.js Server

// Function to ping the server on load.
async function ping()
{
    const url = serverUrl + "/api/ping";
	const response = await fetch(url);
    const pingResponse = await response.text();
    console.log(pingResponse)
}

// Function to determine the die type
function getDieType()
{
    // Get the form of the dice choice
    let diceForm = document.getElementById("dice-choice-id")

    // Return the value of the die type
    return diceForm.elements.choice.value
}

// Function to check if a modifier is selected
function checkModifier()
{
    // Get the form of the modifiers
    let modifierForm = document.getElementById("modifier-id")

    // Get the value for the modifier
    let modifier = modifierForm.elements.modifier.value

    // Set modifier flags
    switch(modifier)
    {
        case "advantage":
            advantage = true
            disadvantage = false
            break
        case "disadvantage":
            advantage = false
            disadvantage = true
            break
        case "none":
            advantage = false
            disadvantage = false
            break
    }
}

// Function to run a roll of the dice
async function runRoll()
{
    // Get die type
    let dieType = getDieType()

    // Get number of dice to roll
    let count = document.getElementById("dice-count-id").value

    // Set modifier state
    checkModifier()

    let rollOne
    let rollTwo

    // Check if second roll needed
    if(advantage || disadvantage)
    {
        rollOne = await rollDice(dieType, count) // first roll
        rollTwo = await rollDice(dieType, count) // second roll
    }
    else
    {
        rollOne = await rollDice(dieType, count) // only roll
        rollTwo = 0
    }

    // Set output to rolled value
    setOutput(rollOne, rollTwo)
}

// Function to set the output to the rolled value
function setOutput(rollOne, rollTwo)
{
    // Gets the result element
    output = document.getElementById("result-id")

    // Rolled with advantage
    if(advantage)
    {
        // Check which roll is higher
        if(rollOne > rollTwo)
        {
            output.value = rollOne
        }
        else
        {
            output.value = rollTwo
        }
    }

    // Rolled with disadvantage
    else if(disadvantage)
    {
        // Check which roll is lower
        if(rollOne > rollTwo)
        {
            output.value = rollTwo
        }
        else
        {
            output.value = rollOne
        }
    }
    
    // Rolled without modification
    else
    {
        output.value = rollOne
    }
}

// Function to calculate a die roll
async function rollDice(dieType, count)
{
    let sum = 0

    for(let i = 0; i < count; i++)
    {
        sum += await callRollDie(dieType)
    }

    return sum
}

// Function to call API for a given die type
async function callRollDie(dieType)
{
	const url = serverUrl + "/roll-" + dieType;
	const response = await fetch(url)
	const responseText = await response.text()
    return Number(responseText)
}