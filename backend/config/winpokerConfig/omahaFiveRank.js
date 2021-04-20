async function omahaFiveRank(hands , boards)
{
    var best_cards;
    var maxPoints = 0;
    var possible_boards = [
        [boards[0], boards[1], boards[2]],
        [boards[0], boards[1], boards[3]],
        [boards[0], boards[1], boards[4]],
        [boards[0], boards[2], boards[3]],
        [boards[0], boards[2], boards[4]],
        [boards[0], boards[3], boards[4]],
        [boards[1], boards[2], boards[3]],
        [boards[1], boards[2], boards[4]],
        [boards[1], boards[3], boards[4]],
        [boards[2], boards[3], boards[4]],        
    ];

    var possible_hands = [
        [hands[0], hands[1]],
        [hands[0], hands[2]],
        [hands[0], hands[3]],
        [hands[0], hands[4]],
        [hands[1], hands[2]],
        [hands[1], hands[3]],
        [hands[1], hands[4]],
        [hands[2], hands[3]],
        [hands[2], hands[4]],
        [hands[3], hands[4]],
    ];

    for (var i = 0; i < possible_hands.length; i++) {
        for (var j = 0; j < possible_boards.length; j++)
        {
            var tmp_cards = [
                possible_boards[j][0],
                possible_boards[j][1],
                possible_boards[j][2],
                possible_hands[i][0],
                possible_hands[i][1],
            ];

            var tmp_points = await get_omaha_points(tmp_cards);
            if (tmp_points > maxPoints) {
                maxPoints = tmp_points;
                best_cards = tmp_cards;
            }
        }
    }
    var returnData = {
        rank : maxPoints,
        rankname : "" ,
        best_cards
    }
    return returnData;
}

async function get_omaha_points(hand)
{
    var points     = 0;
    var hcs        = [];
    var flush      = [];
    var values     = [];
    var sortvalues = [];
    var orig       = ['T' , 'J' , 'Q' , 'K' , 'A'];
    var change     = [10 , 11 , 12 , 13 , 14];
    var handString = hand.toString();
    var res = '';
    for(var i = 0 ; i < orig.length ; i ++){
        handString = handString.split(orig[i]).join(change[i]);
    }
    hands = handString.split(",");
    for(var j = 0 ; j < hands.length ; j ++){
        if (hands[j].length == 2) {
            flush[j] = hands[j].substr(1, 1);
            values[j] = hands[j].substr(0, 1);
            sortvalues[j] = values[j];
        } else {
            flush[j] = hands[j].substr(2, 1);
            values[j] = hands[j].substr(0, 2);
            sortvalues[j] = values[j];
        }
    }

    for(var i = 0 ; i < sortvalues.length ; i ++){
        for(var j = i+1 ; j < sortvalues.length; j ++){
            if(parseInt(sortvalues[i]) > parseInt(sortvalues[j])){
                var temp = sortvalues[i];
                sortvalues[i] = sortvalues[j]
                sortvalues[j] = temp;
            }
        }
    }
    var ispair = {};
    for(var i = 0; i < values.length ; i ++)
    {
        var key = values[i];
        ispair[key] = ispair[key] ? ispair[key] + 1 : 1;
    }
    var results = {}
    for(var i in ispair){
        var key = ispair[i];
        results[key] = results[key] ? results[key] + 1 : 1;
    }

    if (results['2'] == 1)
        res = '1pair';
    if (results['2'] > 1)
        res = '2pair';
    if (results['3'] > 0)
        res = '3s';
    if (results['4'] > 0)
        res = '4s';
    if (((results['3'] > 0) && (results['2'] > 0)) || (results['3'] > 1))
        res = 'FH';

    var z = 0;
    var y = 0;
    var multipair = [] , threepair =[];
    var highpair , high3pair;
    for(var i = 2 ; i < 15 ; i ++){
        if(ispair[i] == 2) {
            multipair[z] = i;
            highpair = i;
            z ++;
        }
        if(ispair[i] == 3) {
            threepair[y] = i;
            high3pair = i;
            y ++;
        }
    }

    var bw = 6;
    var n = 0;
    while ((sortvalues[bw]) && (n < 5)) {
        if(multipair.indexOf(sortvalues[bw]) > -1){
            hcs[n] = sortvalues[bw];
            n ++;
        }
        bw --;
    }

    var h1 = hcs[0] ? hcs[0] : 0;
    var h2 = hcs[1] ? hcs[1] / 10 : 0;
    var h3 = hcs[2] ? hcs[2] / 100 : 0;
    var h4 = hcs[3] ? hcs[3] / 1000 : 0;
    var h5 = hcs[4] ? hcs[4] / 10000 : 0;
    var high1 = h1;
    var high2 = h1 + h2;
    var high3 = h1 + h2 + h3;
    var high5 = h1 + h2 + h3 + h4 + h5;

    if ((res == '1pair') || (res == '2pair') || (res == 'FH')) {
        if (res == '1pair') {
            points = ((highpair * 10) + (high3));
        }

        if (res == '2pair') {
            multipair.sort();
            var pairs = multipair.length;
            var pr1 , pr2;
            if (pairs == 3) {
                pr1 = multipair[2];
                pr2 = multipair[1];
            } else {
                pr1 = multipair[1];
                pr2 = multipair[0];
            }
            points = (((pr1 * 100) + (pr2 * 10)) + high1);
        }
        if (res == 'FH') {
            multipair.sort();
            threepair.sort();
            var pairs  = multipair.length;
            var threes = threepair.length;
            var pr1 , kry1 , kry2;
            if (pairs == 1) {
                pr1 = multipair[0];
            } else {
                pr1 = multipair[1];
            }
            if (threes == 1) {
                kry1 = threepair[0];
            } else {
                kry1 = threepair[1];
                kry2 = threepair[0];
            }
            if (kry2 > pr1)
                pr1 = kry2;
            points = ((kry1 * 1000000) + (pr1 * 100000));
        }
    }
    if (res == '3s') {
        for(var i = 2 ; i < 15 ; i ++){
            if (ispair[i] == 3) {
                points = (i * 1000) + high2;
            }
        }
    }
    if (res == '4s') {
        for(var i = 2 ; i < 15 ; i ++){
            if (ispair[i] == 4) {
                points = i * 10000000 + high1;
            }
        }
    }
    var flushsuit = '';
    var isflush = {};
    for(var i = 0 ; i < flush.length ; i ++){
        var key = flush[i];
        isflush[key] = isflush[key] ? isflush[key] + 1 : 1;
    }
    if (isflush['D'] > 4)
        flushsuit = 'D';
    if (isflush['C'] > 4)
        flushsuit = 'C';
    if (isflush['H'] > 4)
        flushsuit = 'H';
    if (isflush['S'] > 4)
        flushsuit = 'S';


    if (flushsuit != '') {
        res = flushsuit + ' FLUSH DETECTED';
        var flusharray = [];
        var x = 0;
        for(var i = 0 ; i < 7 ; i ++){
            if (flush[i] == flushsuit) {
                flusharray[x] = values[i];
                x ++;
            }
        }
        flusharray.sort();
        var basic    = 250000;
        var z        = flusharray.length - 1;
        var c1       = flusharray[z] * 1000;
        var s1       = flusharray[z];
        var c2       = flusharray[z - 1] * 100;
        var s2       = flusharray[z - 1];
        var c3       = flusharray[z - 2] * 10;
        var s3       = flusharray[z - 2];
        var c4       = flusharray[z - 3];
        var s4       = flusharray[z - 3];
        var c5       = flusharray[z - 4] / 10;
        var s5       = flusharray[z - 4];
        var points   = basic + c1 + c2 + c3 + c4 + c5;
        var flushstr = false;
        var x        = 0;
        var h;

        for(var i = 0 ; i < flusharray.length ; i ++){
            if (flusharray[i] == (flusharray[i + 1] - 1)) {
                x ++;
                h = flusharray[i] + 1;
            }
        }
        if (x > 3)
            points = h * 100000000;
        if ((x > 3) && (h == 14))
            points = h * 1000000000;
    }
    if (flushsuit == '') {
        var straight = false;
        var count    = 0;
        if ((sortvalues[6] == 14) && (sortvalues[0] == 2)){
            count = 1;
        }
        for(var i = 0 ; i < sortvalues.length ; i ++){
            if ((sortvalues[i]) == (sortvalues[i + 1] - 1)) {
                count ++;
                if (count > 3) {
                    straight = true;
                    res      = 'STRAIGHT';
                    h        = sortvalues[i] + 1;
                    points   = h * 10000;
                }
            } else if ((sortvalues[i]) != (sortvalues[i + 1])) {
                count = 0;
            }
        }
    }
    if (res == '') {
        points = high5;
    }
    return points;
}

module.exports = {
    omahaFiveRank
}