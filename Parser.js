
// Need to add export before unit testing.
class Parser {

    arr;
    arr_length;

    constructor(str) {
        const match = /( +-| +[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])){3}/g;
        this.arr = [];
        var match_arr = str.match(match);


        /*
        Splits each matching three dates and puts them into each row.
        Then joins the first end of the row with the mached dates. Stores
        them in the this.arr. Repeat for all matching dates.
         */
        var j = 0;
        for (var i = 0; i < match_arr.length; i++) {
            // build each row.
            var temp_arr = str.split(match_arr[i]);
            var row = [];
            row[0] = temp_arr[0];
            row[1] = match_arr[i];
            this.arr[j] = row.join('');
            // Removes \n and spaces
            this.arr[j] = this.arr[j].trim();
            let complete_row = this.arr[j];

            // Handles no price for product exception
            const re_no_price = /Inget pris +Inget pris/;
            if (re_no_price.test(this.arr[j])) {
                
                // split the line at Inget pris
                let temp = this.arr[j].split(re_no_price);

                // loops through incase there are multiple Inget pris next to each other
                for (let k = 0; k < temp.length - 1; k++) {

                    // Builds a valid row
                    let new_string = temp[k].trim();

                    new_string = new_string + " 0 SEK - - -";

                    this.arr[j] = new_string
                    j++;
                }
                // last row handled seperately
                this.arr[j] = temp[temp.length - 1].trim();

            }

            // removes the line from the original string
            str = str.replace(complete_row, "");

            j++
        }
        this.arr_length = this.arr.length;

    }



    getProductName(i) {
        var row = this.arr[i];
        return row.split(/\(|-*[0-9]+( SEK \/månad| SEK)/)[0].trim();
    }

    getAmount(i) {
        var row = this.arr[i];
        var re = /Inget pris|-*[0-9]+( SEK \/m| SEK)/
        var amount = row.match(re)[0];
        // Special solution because of åäö
        var re_month = / SEK \/m/;
        if (re_month.test(amount)) {
            amount = amount + "onth";
        }

        return amount;
    }

    findDates(i) {
        const match = /( +-| +[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])){3}/g;
        var output = this.arr[i].match(match)[0].trim();
        return output;
    }

    getStartDate(i) {
        const match = / *- *|[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/g;
        var date = this.findDates(i).match(match)[0].trim();
        return date;
    }

    getStopDate(i) {
        const match = / *- *|[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/g;
        var date = this.findDates(i).match(match)[1].trim();
        return date;
    }

    getInvoiceDate(i) {
        const match = / *- *|[1-9][0-9][0-9]{2}-([0][1-9]|[1][0-2])-([1-2][0-9]|[0][1-9]|[3][0-1])/g;
        var date = this.findDates(i).match(match)[2].trim();
        return date;
    }


    // Checks if the product is valid by the date
    static validateDate(row) {
        // Used for comparing dates
        var current_date = new Date();
        var start_date = new Date(row.start_date);
        var stop_date = new Date(row.stop_date);

        // Used for checking that the date is valid
        let start_timestamp = Date.parse(row.start_date);
        let stop_timestamp = Date.parse(row.stop_date);

        let valid = false;
        // If the date is valid
        if ((current_date <= stop_date || isNaN(stop_timestamp)) && (current_date >= start_date || isNaN(start_timestamp))) {
            valid = true
        }
        return valid;
    }


}
