let OVERS=2

if (window.location.href.includes('setup.html')) {
    document.getElementById('start_match').addEventListener('click',function(event) {
        event.preventDefault();
        let team1_name_out = document.getElementById('team1').value;
        let team2_name_out = document.getElementById('team2').value;
        let toss_winner_out = document.getElementById('toss_winner').value;
        let toss_decision_out = document.getElementById('toss_decision').value;

        if(!team1_name_out || !team2_name_out || !toss_winner_out || !toss_decision_out) {
            alert("Please input all the required fields.")
        }
        else {
            let valuesout = `?team1=${encodeURIComponent(team1_name_out)}&team2=${encodeURIComponent(team2_name_out)}&toss_winner=${encodeURIComponent(toss_winner_out)}&toss_decision=${encodeURIComponent(toss_decision_out)}`;
                window.location.href = 'live.html' + valuesout;
        }
    });
}

if (window.location.href.includes('live.html')) {
    let valuesin = new URLSearchParams(window.location.search);
    let team1_name= valuesin.get('team1');
    let team2_name= valuesin.get('team2');
    let toss_winner= valuesin.get('toss_winner');
    if(toss_winner=="team1") {
        toss_winner=team1_name;
    }
    else if(toss_winner=="team2") {
        toss_winner=team2_name;
    }
    let toss_decision= valuesin.get('toss_decision');


    let strike_batter=prompt("Please enter the name of strike batter :");
    let non_strike_batter=prompt("Please enter the name of non strike batter :");
    let bowler=prompt("Please enter the name of bowler");

    let total_runs=0;
    let total_wickets=0;
    let prev_wickets=0;
    let balls_bowled=0;
    let total_inning=1;
    let required_runs=0;

    document.getElementById('strike_batter').innerText = `Strike Batter: ${strike_batter}`;
    document.getElementById('non_strike_batter').innerText = `Non-Strike Batter: ${non_strike_batter}`;
    document.getElementById('current_bowler').innerText = `Current Bowler: ${bowler}`;

    let run=0;
    let wicket=false;
    let won_team=null;
    let overs_done=false;
    let all_out=false;

    document.getElementById('run_0').addEventListener('click', function() {
        run=0;
        if(total_inning==1) {handle_inning_1();}
        else if(total_inning==2) {handle_inning_2();handle_win();}
    });
    document.getElementById('run_1').addEventListener('click', function() {
        run=1;
        if(total_inning==1) {handle_inning_1();}
        else if(total_inning==2) {handle_inning_2();handle_win();}
    });
    document.getElementById('run_2').addEventListener('click', function() {
        run=2;
        if(total_inning==1) {handle_inning_1();}
        else if(total_inning==2) {handle_inning_2();handle_win();}
    });
    document.getElementById('run_3').addEventListener('click', function() {
        run=3;
        if(total_inning==1) {handle_inning_1();}
        else if(total_inning==2) {handle_inning_2();handle_win();}
    });
    document.getElementById('run_4').addEventListener('click', function() {
        run=4;
        if(total_inning==1) {handle_inning_1();}
        else if(total_inning==2) {handle_inning_2();handle_win();}
    });
    document.getElementById('run_6').addEventListener('click', function() {
        run=6;
        if(total_inning==1) {handle_inning_1();}
        else if(total_inning==2) {handle_inning_2();handle_win();}
    });
    document.getElementById('wicket').addEventListener('click', function() {
        wicket=true;
        if(total_inning==1) {handle_inning_1();}
        else if(total_inning==2) {handle_inning_2();handle_win();}
    });

    function handle_inning_1() {
        if(balls_bowled<=6*OVERS && total_ && total_inning==1) {
            if(balls_bowled%6==0 && balls_bowled!=0) {
                total_runs+=run;
                if(run%2==1) {
                    let temp="";
                    temp=strike_batter;
                    strike_batter=non_strike_batter;
                    non_strike_batter=temp
                }
                balls_bowled++;
                alert("End of the over! Please enter the next bowler's name.");
                bowler = prompt("Enter the name of the next bowler:");
                let temp="";
                temp=strike_batter;
                strike_batter=non_strike_batter;
                non_strike_batter=temp;
            }
            else {
                if(!wicket){
                    balls_bowled++;
                    total_runs+=run;
                    if(run%2==1) {
                        let temp="";
                        temp=strike_batter;
                        strike_batter=non_strike_batter;
                        non_strike_batter=temp
                    }
                }
                else if(wicket) {
                    balls_bowled++;
                    total_wickets++;
                    strike_batter = prompt("Enter the name of the next batter:");
                    wicket=false;
                }
            }

            document.getElementById('current_bowler').innerText = `Current Bowler: ${bowler}`;
            document.getElementById('strike_batter').innerText = `Strike Batter: ${strike_batter}`;
            document.getElementById('non_strike_batter').innerText = `Non-Strike Batter: ${non_strike_batter}`;


            if((toss_winner==team1_name && toss_decision=='bat') || (toss_winner==team2_name && toss_decision=='bowl')) {
                document.getElementById('overall_scores').innerText = `${team1_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team2_name}`;
            }
            else if((toss_winner==team1_name && toss_decision=='bowl') || (toss_winner==team2_name && toss_decision=='bat')) {
                document.getElementById('overall_scores').innerText = `${team2_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team1_name}`;
            }
            prev_wickets=total_wickets
            if(balls_bowled==6*OVERS && total_) {
                overs_done=true;
                total_inning++;
                required_runs=total_runs;
                total_runs=0;
                total_wickets=0;
                balls_bowled=0;
            }
            else if(total_wickets==11 && balls_bowled<6*OVERS) {
                all_out=true;
                total_inning++;
                required_runs=total_runs;
                total_runs=0;
                total_wickets=0;
                balls_bowled=0;
            }
        }

    }
    function handle_inning_2() {
        if(balls_bowled==0) {
            alert("Start of inning 2")
            strike_batter=prompt("Please enter the name of strike batter :");
            non_strike_batter=prompt("Please enter the name of non strike batter :");
            bowler=prompt("Please enter the name of bowler");
        }
        if(balls_bowled<=6*OVERS && total_ && total_inning==2 && total_runs<required_runs) {
            if(balls_bowled%6==0 && balls_bowled!=0) {
                total_runs+=run
                if(run%2==1) {
                    let temp="";
                    temp=strike_batter;
                    strike_batter=non_strike_batter;
                    non_strike_batter=temp
                }
                balls_bowled++;
                alert("End of the over! Please enter the next bowler's name.");
                bowler = prompt("Enter the name of the next bowler:");
                let temp="";
                temp=strike_batter;
                strike_batter=non_strike_batter;
                non_strike_batter=temp
            }

            else {
                if(!wicket){
                    balls_bowled++;
                    total_runs+=run
                    if(run%2==1) {
                        let temp="";
                        temp=strike_batter;
                        strike_batter=non_strike_batter;
                        non_strike_batter=temp
                    }
                }
                else if(wicket) {
                    balls_bowled++;
                    total_wickets++;
                    strike_batter = prompt("Enter the name of the next batter:");
                    wicket=false;
                }
            }
                

            document.getElementById('current_bowler').innerText = `Current Bowler: ${bowler}`;
            document.getElementById('strike_batter').innerText = `Strike Batter: ${strike_batter}`;
            document.getElementById('non_strike_batter').innerText = `Non-Strike Batter: ${non_strike_batter}`;

            let current_run_rate = balls_bowled > 0 ? (total_runs / balls_bowled) : 0;
            let required_run_rate = (6*OVERS - balls_bowled > 0) ? (required_runs - total_runs) / (6*OVERS - balls_bowled) : 0;

            document.getElementById('run_rates').innerText=`Current Run Rate: ${current_run_rate}  Requires Run Rare: ${required_run_rate}`

            if((toss_winner==team1_name && toss_decision=='bat') || (toss_winner==team2_name && toss_decision=='bowl')) {
                document.getElementById('overall_scores').innerText = `${team2_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team1_name} ${required_runs}/${prev_wickets} (${OVERS}.0)`;
            }
            else if((toss_winner==team1_name && toss_decision=='bowl') || (toss_winner==team2_name && toss_decision=='bat')) {
                document.getElementById('overall_scores').innerText = `${team1_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team2_name} ${required_runs}/${prev_wickets} (${OVERS}.0)`;
            }
        }
    }

    function handle_win() {
        if((balls_bowled==6*OVERS && total_runs<required_runs) || total_wickets==11) {
            won_team=1;
        }
        else if(total_runs>=required_runs) {
            won_team=2;
        }
        else if((balls_bowled==6*OVERS && total_runs==required_runs)) {
            won_team=0;
        }
        if (won_team !== null) {
            document.querySelectorAll("button").forEach(btn => btn.disabled = true);
          }
    
    }
}
