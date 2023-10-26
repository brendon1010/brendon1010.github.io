let orderNum = 0      //create variable to increment for each order
let allOrders = []    //create array to store all orders

function ingredient(){     //function defined to get ingredient and corresponding random main meal
    let status = "incomplete"    //status left at incomlete by default

    function FinalObj(_ing, _num, _stat){   //create an object to store important details of order
        this.description = _ing
        this.orderNumber = _num
        this.status = _stat
    }

    let mainIngredient = prompt("input main ingredient")    //get input from user for the main ingredient
    mainIngredient = mainIngredient.toLowerCase()    //convert input to all lowercase
    mainIngredient = mainIngredient.replace(/ /g, "_")   //change all spaces with '_' in input 

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`)   //fetch main meals api using input
        .then((res) => res.json())    //convert to usable object
        .then((result) => {
            let meal = result.meals    //access meals array from result and apply it to meal variable
            if(meal){        //check if meal is found or not
            let rando = Math.floor(Math.random() * meal.length)    //get random index from the meals array
            let order = meal[rando].strMeal     //acces the strMeal of the random meal and apply to new variable
            let myObj = new FinalObj(order, orderNum, status)     //create new object using defined variables
            allOrders.push(myObj)    //push object to allOrders array
            sessionStorage.setItem('orders', JSON.stringify(allOrders))   //store array
            sessionStorage.setItem(`meal${orderNum}`, JSON.stringify(myObj))   //store new object named meal with its specific number
            } else{     //condition for if ingredient is not found
                alert("No meals found")    
                ingredient()     //recursion for user to reinput an ingredient
            }
        })
        .catch((error) => {   //error handling
            console.log("Something went wrong! check spelling of  " + mainIngredient, error)
        })
}

let myButton = document.getElementById("clicker")    //get button from the html
myButton.addEventListener("click", () => {     //increase the order num each button click and store it as lastOrder
    orderNum++
    sessionStorage.setItem('lastOrder', orderNum)   //store the last order number
})

function displayOrders(){     //function to display stored orders and change statuses

    let last = parseInt(sessionStorage.getItem('lastOrder'))    //retrieve the last order number
    let myMealsArr = []    //create array to store all the meals
    let myMealsStr = ""    //create string to add meals into
    
    for(let i = 1; i <= last; i++){    //loop to get each meal
        let meal = sessionStorage.getItem(`meal${i}`)  //get specific meal from storage
        meal = JSON.parse(meal)     //make meal usable object
        myMealsArr.push(meal)    //push meal to array
    }

    myMealsArr = myMealsArr.filter(item => item.status === "incomplete")   //filter the meals in the array by only the incomplete
    
    for(let i = 0; i < myMealsArr.length; i++){    //loop to add each meal to the string in a structured way
        myMealsStr += `description: ${myMealsArr[i].description}, order number: ${myMealsArr[i].orderNumber}\n`
    }

    myMealsStr += "\nEnter order number to mark as complete or enter '0' to mark non as complete"  //add final message in the string
    let answer = prompt(myMealsStr)    //prompt the string to ask for order number while displaying the meals

    if(answer === null || answer === "" || answer < 0){   //condition for if the answer is null or is left blank or is less than 0
        alert("that order is not valid")
    }

    else if(answer === '0'){     //condition for if the answer is 0
        alert("no order has been updated")
    }

    else if(answer <= last && !isNaN(answer)){   //condition for if the number is valid
        let mealToUpdate = sessionStorage.getItem(`meal${answer}`)    //get specific meal based on the input and assign to variable
        mealToUpdate = JSON.parse(mealToUpdate)      //change meal to usable object
        alert(`${mealToUpdate.description} order has been completed`)     //alert that its status has been updataed
        mealToUpdate.status = "completed"     //change status to complete
        sessionStorage.setItem(`meal${answer}`, JSON.stringify(mealToUpdate))   //set meal back in storage
        let theOrders = sessionStorage.getItem('orders')      //retrieve the allorders array from storage
        theOrders = JSON.parse(theOrders)     //change it usable object
        theOrders[answer - 1].status = "completed"    //change its status to complete
        sessionStorage.setItem('orders', JSON.stringify(theOrders))     //put back in storage
    }

    else {        //if all others fail
        alert("order does not exist")
    }
    let foodStr = document.getElementById("food")
    let allMyOrders = sessionStorage.getItem('orders')
    allMyOrders = JSON.parse(allMyOrders)

    foodStr.innerHTML = ""
    for(let i = 0; i < allMyOrders.length; i++){
        if(allMyOrders[i].status === "completed"){
            foodStr.innerHTML += `<br><br>${allMyOrders[i].description}, Order Number: ${allMyOrders[i].orderNumber}<br><br>`
        }
    }
}
