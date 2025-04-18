// let OVERS = 2;

if (window.location.href.includes('setup.html')) {
    
    document.getElementById('start_match').addEventListener('click', function(event) {
        event.preventDefault();
        let team1_name_out = document.getElementById('team1').value;
        let team2_name_out = document.getElementById('team2').value;
        let toss_winner_out = document.getElementById('toss_winner').value;
        let toss_decision_out = document.getElementById('toss_decision').value;
        let OVERS = parseInt(document.getElementById('num_overs').value) || 2;

        if (!team1_name_out || !team2_name_out || !toss_winner_out || !toss_decision_out) {
            alert("Please input all the required fields.");
        } 
        else {
            let values_out = `?team1=${encodeURIComponent(team1_name_out)}&team2=${encodeURIComponent(team2_name_out)}&toss_winner=${encodeURIComponent(toss_winner_out)}&toss_decision=${encodeURIComponent(toss_decision_out)}&OVERS=${encodeURIComponent(OVERS)}`;
            localStorage.clear();
            localStorage.setItem("initial_params", values_out);
            window.location.href = 'live.html' + values_out;
        }
    });
}

if (window.location.href.includes('live.html')) {
    let valuesin = new URLSearchParams(window.location.search);
    let team1_name = valuesin.get('team1');
    let team2_name = valuesin.get('team2');
    let toss_winner = valuesin.get('toss_winner');
    let OVERS=valuesin.get('OVERS');
    if (toss_winner == "team1") {
        toss_winner = team1_name;
    } 
    else if (toss_winner == "team2") {
        toss_winner = team2_name;
    }
    let toss_decision = valuesin.get('toss_decision');

    // let strike_batter = prompt("Please enter the name of strike batter:") || "Player 1";
    // let non_strike_batter = prompt("Please enter the name of non-strike batter:") || "Player 2";
    // let bowler = prompt("Please enter the name of bowler:") || "Bowler 1";

    // document.getElementById('strike_batter').innerText = `Strike Batter: ${strike_batter}`;
    // document.getElementById('non_strike_batter').innerText = `Non-Strike Batter: ${non_strike_batter}`;
    // document.getElementById('current_bowler').innerText = `Current Bowler: ${bowler}`;

    
    localStorage.setItem("OVERS", OVERS);

    let total_runs = 0;
    let total_wickets = 0;
    let prev_wickets = 0;
    let balls_bowled = 0;
    let total_inning = 1;
    let required_runs = 0;
    let second_innings_started = false;

    let run = 0;
    let wide=false;
    let wicket = false;
    let won_team = null;
    let bowler="";
    let strike_batter="";
    let non_strike_batter="";

    let batters = {};
    let bowlers = {};
    
    let saved_state = localStorage.getItem("match_state");
    if (saved_state) {
        let state = JSON.parse(saved_state);
        total_runs = state.total_runs;
        total_wickets = state.total_wickets;
        balls_bowled = state.balls_bowled;
        total_inning = state.total_inning;
        required_runs = state.required_runs;
        batters = state.batters;
        bowlers = state.bowlers;
        strike_batter = state.strike_batter;
        non_strike_batter = state.non_strike_batter;
        bowler = state.bowler;
        second_innings_started = state.second_innings_started;
        prev_wickets=state.prev_wickets;
        required_runs=state.required_runs;

        update_display();
        update_score_display();
    }
    else if (!saved_state && total_inning == 1) {
        strike_batter = prompt("Please enter the name of strike batter:") || "Player 1";
        update_batter_stats(strike_batter, 0, 0,true);
        non_strike_batter = prompt("Please enter the name of non-strike batter:") || "Player 2";
        update_batter_stats(non_strike_batter, 0, 0,true);
        bowler = prompt("Please enter the name of bowler:") || "Bowler 1";
    }
    document.getElementById('strike_batter').innerText = `Strike Batter: ${strike_batter}`;
    document.getElementById('non_strike_batter').innerText = `Non-Strike Batter: ${non_strike_batter}`;
    document.getElementById('current_bowler').innerText = `Current Bowler: ${bowler}`;
    save_match_state();
    update_display();
    update_score_display();

    document.getElementById('run_0').addEventListener('click', function() {
        run = 0;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
    });
    document.getElementById('run_1').addEventListener('click', function() {
        run = 1;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
    });
    document.getElementById('run_2').addEventListener('click', function() {
        run = 2;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
    });
    document.getElementById('run_3').addEventListener('click', function() {
        run = 3;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
    });
    document.getElementById('run_4').addEventListener('click', function() {
        run = 4;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
        const four_image = document.getElementById('four_image');
        four_image.style.display = 'block';
        setTimeout(function() {
            four_image.style.display = 'none';
        }, 1200);
    });
    document.getElementById('run_6').addEventListener('click', function() {
        run = 6;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
        const six_image = document.getElementById('six_image');
        six_image.style.display = 'block';
        setTimeout(function() {
            six_image.style.display = 'none';
        }, 1200);
    });
    document.getElementById('wide').addEventListener('click', function() {
        wide=true;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
    });
    document.getElementById('wicket').addEventListener('click', function() {
        wicket = true;
        if (total_inning == 1) { handle_inning_1(); }
        else if (total_inning == 2) { handle_inning_2(); handle_win(); }
        // const out_image = document.getElementById('out_image');
        // out_image.style.display = 'block';
        // setTimeout(function() {
        //     out_image.style.display = 'none';
        // }, 1200);
    });

    function update_display() {
        document.getElementById('current_bowler').innerText = `Current Bowler: ${bowler}`;
        document.getElementById('strike_batter').innerText = `Strike Batter: ${strike_batter}`;
        document.getElementById('non_strike_batter').innerText = `Non-Strike Batter: ${non_strike_batter}`;
    }

    function update_batter_stats(name, runs_scored, is_out = false,newb=false,extra_balls=0) {
        if (!batters[name]) {
            batters[name] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: false, newb: true, extras: 0, inning: 0,};
        }
        batters[name].runs += runs_scored;
        if(!batters[name].newb){
            if(extra_balls==0) {
                batters[name].balls += 1;
            }
        }
        else if(batters[name].newb) {batters[name].balls =0;batters[name].newb=false;}
        if (runs_scored === 4) batters[name].fours += 1;
        if (runs_scored === 6) batters[name].sixes += 1;
        if (is_out) batters[name].out = true;
        if(extra_balls!=0) {batters[name].extras+=extra_balls;}
        batters[name].inning=total_inning;
    }

    function update_bowler_stats(name, runs_conceded, took_wicket = false,extras=false) {
        if (!bowlers[name]) {
            bowlers[name] = { balls: 0, runs: 0, wickets: 0, maidens: 0, maiden_balls: 0,inning: 0, };
        }
        if(!extras){bowlers[name].balls += 1;}
        bowlers[name].runs += runs_conceded;
        if (took_wicket) bowlers[name].wickets += 1;
        if (runs_conceded == 0) {
            bowlers[name].maiden_balls += 1;
        } 
        else {
            bowlers[name].maiden_balls = 0; // Reset maiden balls if runs are conceded
        }
        if (bowlers[name].maiden_balls == 6) {
            bowlers[name].maidens += 1;
            bowlers[name].maiden_balls = 0; // Reset maiden balls after a maiden over
        }
        bowlers[name].inning=total_inning;

    }

    function save_scorecard_to_storage() {
        localStorage.setItem("batters", JSON.stringify(batters));
        localStorage.setItem("bowlers", JSON.stringify(bowlers));
        localStorage.setItem("team1", team1_name);
        localStorage.setItem("team2", team2_name);
        localStorage.setItem("total_inning",total_inning);
    }

    function update_score_display() {
        if (total_inning == 1) {
            if ((toss_winner == team1_name && toss_decision == 'bat') || (toss_winner == team2_name && toss_decision == 'bowl')) {
                document.getElementById('overall_scores').innerText = `${team1_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team2_name}`;
            } else if ((toss_winner == team1_name && toss_decision == 'bowl') || (toss_winner == team2_name && toss_decision == 'bat')) {
                document.getElementById('overall_scores').innerText = `${team2_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team1_name}`;
            }
        } else if (total_inning == 2) {
            let current_run_rate = balls_bowled > 0 ? (total_runs / (balls_bowled / 6)).toFixed(2) : 0;
            let remaining_overs = (6 * OVERS - balls_bowled) / 6;
            let required_run_rate = remaining_overs > 0 ? ((required_runs - total_runs) / remaining_overs).toFixed(2) : 0;

            document.getElementById('run_rates').innerText = `Current Run Rate: ${current_run_rate} Required Run Rate: ${required_run_rate}`;

            if ((toss_winner == team1_name && toss_decision == 'bat') || (toss_winner == team2_name && toss_decision == 'bowl')) {
                document.getElementById('overall_scores').innerText = `${team2_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team1_name} ${required_runs - 1}/${prev_wickets} (${OVERS}.0)`;
            } else if ((toss_winner == team1_name && toss_decision == 'bowl') || (toss_winner == team2_name && toss_decision == 'bat')) {
                document.getElementById('overall_scores').innerText = `${team1_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team2_name} ${required_runs - 1}/${prev_wickets} (${OVERS}.0)`;
            }
        }
    }

    function save_match_state() {
        localStorage.setItem("match_state", JSON.stringify({
            total_runs,
            total_wickets,
            prev_wickets,
            balls_bowled,
            total_inning,
            required_runs,
            strike_batter,
            non_strike_batter,
            bowler,
            second_innings_started,
            batters,
            bowlers,
        }));
    }



    function handle_balls() {
        if (!wicket) {
            if(wide) {
                total_runs++;
                update_bowler_stats(bowler, 1,false,true);
                wide = false;
                update_batter_stats(strike_batter,run,wicket,false,1);
                save_scorecard_to_storage();
                save_match_state();
                update_display();
                update_score_display();
                return;
            }
            else {
                balls_bowled++;
                total_runs += run;
                
                update_batter_stats(strike_batter, run, wicket);
                update_bowler_stats(bowler, run, wicket);
            
                if (run % 2 == 1) {
                    let temp = strike_batter;
                    strike_batter = non_strike_batter;
                    non_strike_batter = temp;
                }
                if (balls_bowled % 6 == 0 && balls_bowled !== 6 * OVERS) {
                    update_display();
                    setTimeout(() => {
                        if (total_inning == 1) {
                            bowler = prompt("Enter the name of the next bowler:") || "Bowler " + (Math.floor(balls_bowled / 6) + 1);
                        } else if (total_inning == 2) {
                            bowler = prompt("Enter the name of the next bowler:") || "Bowler2 " + (Math.floor(balls_bowled / 6) + 1);
                        }
                        update_display();
                    }, 100);
                }
            }
        }
        else if (wicket) {
            balls_bowled++;
            total_wickets++;
            update_batter_stats(strike_batter, run, wicket);
            update_bowler_stats(bowler, run, wicket);
            if(total_inning==1) {
                if(total_wickets<10) {
                    strike_batter = prompt("Enter the name of the next batter:") || "Player " + (total_wickets + 2);
                    update_batter_stats(strike_batter, 0, 0,true);
                }
            }
            else if(total_inning==2) {
                if(total_wickets<10) {
                    strike_batter = prompt("Enter the name of the next batter:") || "Player2 " + (total_wickets + 2);
                    update_batter_stats(strike_batter, 0, 0,true);
                }
            }
            if (balls_bowled % 6 == 0) {
                if(total_inning==1) {bowler = prompt("Enter the name of the next bowler:") || "Bowler " + (Math.floor(balls_bowled / 6) + 1);}
                else if(total_inning==2) {bowler = prompt("Enter the name of the next bowler:") || "Bowler2 " + (Math.floor(balls_bowled / 6) + 1);}
            }
        }
        wicket=false;
        save_scorecard_to_storage();
        save_match_state();
        update_display();
        update_score_display();
        run=0;
        if (total_inning == 1 && (balls_bowled >= 6 * OVERS || total_wickets == 10)) {
            total_inning++;
            required_runs = total_runs + 1;
            total_runs = 0;
            prev_wickets = total_wickets;
            total_wickets = 0;
            balls_bowled = 0;
            second_innings_started = false;
            setTimeout(() => {
                alert("End of inning 1. Start of inning 2.");
                strike_batter = prompt("Please enter the name of strike batter:") || "Player2 1";
                update_batter_stats(strike_batter, 0, 0);
                non_strike_batter = prompt("Please enter the name of non-strike batter:") || "Player2 2";
                update_batter_stats(non_strike_batter, 0, 0);
                bowler = prompt("Please enter the name of bowler:") || "Bowler2 1";

                update_display();
            },100);
            second_innings_started = true;
            save_scorecard_to_storage();
            save_match_state();
            update_display();
            update_score_display();
            return;
        }
        
    }
    function handle_inning_1() {
        if (balls_bowled < 6 * OVERS && total_wickets < 10 && total_inning == 1) {
            handle_balls();
            update_score_display();
            save_match_state();
            save_scorecard_to_storage();
            // if ((toss_winner == team1_name && toss_decision == 'bat') || (toss_winner == team2_name && toss_decision == 'bowl')) {
            //     document.getElementById('overall_scores').innerText = `${team1_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team2_name}`;
            // } 
            // else if ((toss_winner == team1_name && toss_decision == 'bowl') || (toss_winner == team2_name && toss_decision == 'bat')) {
            //     document.getElementById('overall_scores').innerText = `${team2_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team1_name}`;
            // }
        }
    }

    function handle_inning_2() {
        if (balls_bowled < 6 * OVERS && total_wickets < 10 && total_inning == 2 && total_runs < required_runs) {
            // if (!second_innings_started) {
            //     strike_batter = prompt("Please enter the name of strike batter:") || "Player2 1";
            //     non_strike_batter = prompt("Please enter the name of non-strike batter:") || "Player2 2";
            //     bowler = prompt("Please enter the name of bowler:") || "Bowler2 1";
            //     second_innings_started = true;
            //     save_match_state();
            //     update_display();
            //     update_score_display();
            //     return;
            // }
            handle_balls();
            save_scorecard_to_storage();
            update_score_display();

            let current_run_rate = balls_bowled > 0 ? (total_runs/(balls_bowled/6)).toFixed(2) : 0;
            let remaining_overs = (6*OVERS-balls_bowled) / 6;
            let required_run_rate = remaining_overs > 0 ? ((required_runs-total_runs)/remaining_overs).toFixed(2) : 0;

            document.getElementById('run_rates').innerText = `Current Run Rate: ${current_run_rate} Required Run Rate: ${required_run_rate}`;
            update_score_display();
            // if ((toss_winner == team1_name && toss_decision == 'bat') || (toss_winner == team2_name && toss_decision == 'bowl')) {
            //     document.getElementById('overall_scores').innerText = `${team2_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team1_name} ${required_runs-1}/${prev_wickets} (${OVERS}.0)`;
            // } 
            // else if ((toss_winner == team1_name && toss_decision == 'bowl') || (toss_winner == team2_name && toss_decision == 'bat')) {
            //     document.getElementById('overall_scores').innerText = `${team1_name} ${total_runs}/${total_wickets} (${Math.floor(balls_bowled / 6) + (balls_bowled % 6) / 10}) vs. ${team2_name} ${required_runs-1}/${prev_wickets} (${OVERS}.0)`;
            // }
        }
    }

    function handle_win() {
        type=null;
        if (total_inning != 2) return;
        else {
            let first_batting_team = (toss_winner == team1_name && toss_decision == 'bat') || (toss_winner == team2_name && toss_decision == 'bowl') ? team1_name : team2_name;
            let second_batting_team = first_batting_team == team1_name ? team2_name : team1_name;

            if ((balls_bowled == 6 * OVERS && total_runs < required_runs) || total_wickets == 10) {
                won_team = first_batting_team;
                lose_team = second_batting_team;
                type = 1;
                update_display();
                setTimeout(() => {
                    alert(`${won_team} wins the match!`);
                    update_display();
                },100);
                
            } 
            else if (total_runs >= required_runs) {
                won_team = second_batting_team;
                lose_team = first_batting_team;
                type = 2;
                update_display();
                setTimeout(() => {
                    alert(`${won_team} wins the match!`);
                    update_display();
                },100);
            } 
            else if (balls_bowled == 6 * OVERS && total_runs == required_runs) {
                won_team = "tie";
                type = 3;
                update_display();
                setTimeout(() => {
                    alert("Match ends in a tie!");
                    update_display();
                },100);
                
            }
            if (won_team !== null && type !== null) {
                localStorage.setItem("won_team", won_team);
                localStorage.setItem("type", type);
                save_scorecard_to_storage();
                window.location.href = "summary.html";
            }
        }
    }
    
    document.getElementById("go_to_scorecard").addEventListener('click', function(){
        save_match_state();
        window.location.href = "scorecard.html";
    });
}

if (window.location.href.includes("scorecard.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const isMatchDone = urlParams.get('done') === 'true';
    if(isMatchDone) {
        back_to_live = document.getElementById("back_to_live");
        back_to_summary=document.getElementById("back_to_summary");
        if (back_to_live) {
            back_to_live.style.display = "none";
        }
        if (!back_to_summary) {
            back_to_summary.style.display = "none";
        }
    }
    else {
        back_to_live = document.getElementById("back_to_live");
        back_to_summary=document.getElementById("back_to_summary");
        back_to_summary.style.display = "none";
    }
    const batters_data = JSON.parse(localStorage.getItem("batters") || "{}");
    const bowlers_data = JSON.parse(localStorage.getItem("bowlers") || "{}");
    // const team1 = localStorage.getItem("team1");
    // const team2 = localStorage.getItem("team2");
    const total_inning = localStorage.getItem("total_inning");

    let batting_table_inning1 = document.getElementById("batting_table_inning1");
    let batting_table_inning2 = document.getElementById("batting_table_inning2");
    Object.entries(batters_data).forEach(([name, stats]) => {
        const row = document.createElement("tr");
        let strike_rate = (stats.balls>0) ? (stats.runs/stats.balls)*100 : 0;
        strike_rate = strike_rate.toFixed(2);
        row.innerHTML = `<td>${name}</td> <td>${stats.runs}</td> <td>${stats.balls}</td> <td>${stats.fours}</td> <td>${stats.sixes}</td> <td>${strike_rate}</td> <td>${stats.extras}</td> <td>${stats.out ? 'Out' : 'Not Out'}</td>`;
        if(stats.inning==1) {batting_table_inning1.appendChild(row);}
        else if(stats.inning==2) {batting_table_inning2.appendChild(row);}
        
    });

    let bowling_table_inning1 = document.getElementById("bowling_table_inning1");
    let bowling_table_inning2 = document.getElementById("bowling_table_inning2");
    Object.entries(bowlers_data).forEach(([name, stats]) => {
        const row = document.createElement("tr");
        const overs = `${Math.floor(stats.balls / 6)}.${stats.balls % 6}`;
        const economy = stats.runs*6/stats.balls;
        row.innerHTML = `<td>${name}</td> <td>${overs}</td> <td>${stats.runs}</td> <td>${stats.wickets}</td> <td>${stats.maidens}</td> <td>${economy}</td>`;
        if(stats.inning==1) {bowling_table_inning1.appendChild(row);}
        else if(stats.inning==2) {bowling_table_inning2.appendChild(row);}
    });

    document.getElementById("back_to_live").addEventListener('click', ()=>{
        let values_out = localStorage.getItem("initial_params") || '';
        window.location.href = 'live.html' + values_out;
    });

    document.getElementById("back_to_summary").addEventListener('click', ()=>{
        window.location.href = "summary.html";
    });
    
    if(total_inning==1) {
        batting_table_inning2.style.display="none";
        bowling_table_inning2.style.display="none";
        document.getElementById("batting_heading_inning2").style.display="none";
        document.getElementById("bowling_heading_inning2").style.display="none";
    }

    else if(total_inning==2) {
        batting_table_inning2.style.display="table";
        bowling_table_inning2.style.display="table";
        document.getElementById("batting_heading_inning2").style.display="block";
        document.getElementById("bowling_heading_inning2").style.display="block";
    }
}

if (window.location.href.includes("summary.html")) {
    const matchState = JSON.parse(localStorage.getItem("match_state"));
    let OVERS=localStorage.getItem("OVERS");
    let won_team=localStorage.getItem("won_team");
    let type=localStorage.getItem("type");
    if(type==1) {
        const required_runs = matchState?.required_runs;
        const total_runs = matchState?.total_runs;
        win_runs=required_runs-total_runs-1;
        document.getElementById("win").innerText=`${won_team} wins by ${win_runs} runs!`;
    }
    if(type==2) {
        const total_wickets = matchState?.total_wickets;
        let req_wickets=10-total_wickets;
        const balls_bowled=matchState?.balls_bowled;
        let req_balls=6*OVERS-balls_bowled;
        document.getElementById("win").innerText=`${won_team} wins by ${req_wickets} wickets ! ( ${req_balls} balls left )`;
    }

    document.getElementById("go_to_scorecard_from_summary").addEventListener('click', function(){
        window.location.href = "scorecard.html?done=true";
    });

    document.getElementById("reset_match").addEventListener('click', function(){
        window.location.href = "setup.html";
    });
}

