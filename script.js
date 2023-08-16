//import {Parser} from './Parser';




function run() {
    var input = getInput();
    var content_arr = sortByStartDate(parseInput(input));
    var reference = addRows(content_arr);
    var monthlySum = calculateMonthlySum(content_arr);
    addAmount(reference, monthlySum);
    //var staticSum = calculateStaticSum(content_arr);

    // Clears the textarea
    document.getElementById("input_data").value = "";

}

function calculateMonthlySum(content_arr) {
    let total = 0;
    const value_re = /[0-9]+/;
    const substract_re = /-/;
    const month_re = /month/;

    // First extract the amount
    for (let i = 0; i < content_arr.length; i++) {
        let string_value_arr = content_arr[i]["amount"].match(value_re);

        // Makes sure that the amount isn't null
        if (string_value_arr != null) {
            let value = parseInt(string_value_arr[0]);

            // Makes sure that the date is valid and that it's a monthly payment
            if (Parser.validateDate(content_arr[i]) && month_re.test(content_arr[i]["amount"])) {

                // Subtract or add
                if (substract_re.test(content_arr[i]["amount"])) {
                    total -= value;
                } else {
                    total += value;
                }

            }
        }

    }
    return total;
}

// Sorts using selection sort. Sorts start dates in descending order
function sortByStartDate(arr) {
    for (let i = 0; i < arr.length; i++) {
        let lowest = i
        for (let j = i + 1; j < arr.length; j++) {

            let start_date = new Date(arr[j]["start_date"]);
            let start_date_lowest = new Date(arr[lowest]["start_date"]);

            if (start_date > start_date_lowest) {
                lowest = j
            }
        }
        if (lowest !== i) {
            // Swap
            ;[arr[i], arr[lowest]] = [arr[lowest], arr[i]]
        }
    }
    return arr
}

// Returns the last added element
function addRows(content_arr) {
    // First reference to place the new divs by
    let reference = document.getElementById("names_container");

    // Loops through the array of contents
    for (let i = 0; i < content_arr.length; i++) {

        let row_container = document.createElement("div");

        const monthly_re = / SEK \/m/;

        // If the date is valid
        if (Parser.validateDate(content_arr[i]) && monthly_re.test(content_arr[i]["amount"])) {
            // monthly price currently active
            row_container.id = "rad";
        } else if (!Parser.validateDate(content_arr[i])) {
            row_container.id = "rad2";
        } else {
            // static price currently active
            row_container.id = "rad3";
        }

        addText(row_container, content_arr[i]);
        insertAfter(reference, row_container);

        // Updates the reference to the latest div
        reference = row_container;

    }
    return reference;
}


function addAmount(reference, amount) {
    //reference = document.getElementById("names_container");

    let container = document.createElement("div");
    container.id = "print_amount"

    let p = document.createElement("p");
    p.textContent = amount + " SEK /month";
    container.appendChild(p);
    insertAfter(reference, container);

}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addText(row_container, content) {

    let p = document.createElement("p");
    p.textContent = content["product_name"];
    row_container.appendChild(p);
    p = document.createElement("p");
    p.textContent = content["amount"];
    row_container.appendChild(p);
    p = document.createElement("p");
    p.textContent = content["start_date"];
    row_container.appendChild(p);
    p = document.createElement("p");
    p.textContent = content["stop_date"];
    row_container.appendChild(p);
    p = document.createElement("p");
    p.textContent = content["invoice_date"];
    row_container.appendChild(p);

}

function getInput() {

    var doc = document.getElementById("input_data");
    var input;

    // Checks if element exists and loads input
    if (doc == null) {
        input = null; 
    } else { input = doc.value;}
    if (!input) {console.log("Input_test is missing!\n");}

    return input;
}


function parseInput(input) {

    var parser = new Parser(input);
    var content = new Array;

    for (var i = 0; i < parser.arr_length; i++) {

        var row = new Object;

        row["product_name"] = parser.getProductName(i)
        row["amount"] = parser.getAmount(i);
        row["start_date"] = parser.getStartDate(i);
        row["stop_date"] = parser.getStopDate(i);
        row["invoice_date"] = parser.getInvoiceDate(i);
        content[i] = row;
        /*
        let print_row = content[i];
        console.log(print_row["product_name"]);
        console.log(print_row["amount"]);
        console.log(print_row["start_date"]);
        console.log(print_row["stop_date"]);
        console.log(print_row["invoice_date"]);
        console.log("---------------------");

         */

    }
    return content;
}

