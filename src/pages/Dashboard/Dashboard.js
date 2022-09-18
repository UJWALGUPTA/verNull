import React, { useState } from "react";
import {
	useContract,
	useContractRead,
	Web3Button,
	ConnectWallet,
	useAddress,
	useContractWrite,
	useAccount,
} from "@thirdweb-dev/react";
import { hexToNumber } from "web3-utils";
import style from "./Dashboard.module.scss";
import sad from "../../Assets/sad.png";
import arrow from "../../Assets/arrow.png";
import ToggleSwitch from "../../components/toggleBtn/Toggle";
import Camera from "../../components/Camera/Camera";
import ScreenTime from "../../components/ScreenTime";
// import Chart from '../../components/Chart/Chart'
import graph from "../../Assets/graph.png";

const contractAddress = "0x7Bb4A2c24b3eDD7Ca6Eb1ddA1cC74b15B562e130";

function Dashboard() {
	// Blockchain Integration
	const address = useAddress();
	const account = useAccount();

	// Get the smart contract
	const { contract } = useContract(
		"0x7Bb4A2c24b3eDD7Ca6Eb1ddA1cC74b15B562e130"
	);

	// Read the current greeting
	const {
		data: currentRewards,
		isLoading1,
		error1,
	} = useContractRead(contract, "balanceOf", address);

	// implementation
	{
		isLoading1 ? "Loading..." : currentRewards && hexToNumber(currentRewards);
	}

	//wrtie the contract
	const {
		mutate: register,
		isLoading,
		error,
	} = useContractWrite(contract, "register");

	//implemention
	// onClick={() => register()}

	const {
		mutate: dailyRewards,
		isLoading2,
		error2,
	} = useContractWrite(contract, "dailyRewards");

	//implemention
	// onClick={() => dailyRewards([accuracy, streak, address])}

	const {
		mutate: streakRewards,
		isLoading3,
		error3,
	} = useContractWrite(contract, "streakRewards");

	//implemention
	// onClick={() => streakRewards([streak, address])}

	let time = localStorage.getItem("avgScreenTime");
	let posture = JSON.parse(
		localStorage.getItem("dailyPosture") != undefined
			? localStorage.getItem("dailyPosture")
			: JSON.stringify([])
	);
	if (posture == undefined) posture = [1];
	const [dailyPush, setDailyPush] = useState([]);
	let aggPosture = 0;
	posture.forEach((x) => (aggPosture = aggPosture + Number(x)));
	console.log(aggPosture);
	posture = aggPosture / posture.length;
	posture = parseInt(posture * 100);
	return (
		<div className={style.wrapper}>
			{/* 
<ConnectWallet accentColor="#262C3A" colorMode="dark" />
			<p>
				Address: <b>{address}</b>
			</p>
			<p>
				Current greeting:{" "}
				<b>
					{isLoading1
						? "Loading..."
						: currentRewards && hexToNumber(currentRewards)}
				</b>
			</p>
			<button
				// contractAddress={contractAddress}
				onClick={() => dailyRewards([86, 1, address])}
				// colorMode="light"
				// accentColor="#F213A4"
			>
				Daily Rewards
			</button>

			<button
				// contractAddress={contractAddress}
				onClick={() => streakRewards([1, address])}
				// colorMode="light"
				// accentColor="#F213A4"
			>
				streak Rewards
			</button>

			<button
				// contractAddress={contractAddress}
				onClick={() => dailyRewards([86, 1, address])}
				// colorMode="light"
				// accentColor="#F213A4"
			>
				Daily Rewards
			</button> */}

			{/* f1 */}
			<div className={style.f1}>
				<Camera setDailyPush={setDailyPush} />
			</div>
			{/* f2 */}
			<div className={style.f2}>
				<div
					className={style.left}
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<img src={graph} style={{ width: "80%" }} />
				</div>
				<div className={style.right}>
					<div className={style.top}>
						<div className={style.t1}>
							<div>Current screen Time :</div>
							<ScreenTime />
						</div>
						<div className={style.t2}>
							<div>Average screen time : </div>
							{time != undefined ? (
								<div>
									{time / 3600 < 10
										? "0" + parseInt(time / 3600)
										: parseInt(time / 3600)}
									h{" "}
									{time / 60 < 10
										? "0" + parseInt(time / 60)
										: parseInt(time / 60)}
									m{" "}
									{time % 60 < 10
										? "0" + parseInt(time % 60)
										: parseInt(time % 60)}
									s{" "}
								</div>
							) : (
								<div> 00h 00m 00s</div>
							)}
						</div>
					</div>
					<div className={style.bottom}>
						<div className={style.left}>
							<div>Avg Posture %</div>
							<div>{posture}%</div>
						</div>
						<div className={style.right}>
							<div>You snoozed 20-20 mode</div>
							<div>25 times</div>
						</div>
					</div>
				</div>
			</div>
			{/* f3 */}
			<div className={style.f3}>
				<div className={style.left}>
					<div className={style.l1}>
						<div>Presentation Mode </div>
						<div>
							Turn off camera access for monitoring posture while doing online
							presentations
						</div>
					</div>
					<div className={style.l2}>
						<ToggleSwitch label="1" />
					</div>
				</div>
				<div className={style.right}>
					<div className={style.l1}>
						<div>20-20 Rule Mode</div>
						<div>
							After every 20 minutes, guess and sing along prompt will
							automatically pop up on your screen to give you a 20 sec break.
						</div>
					</div>
					<div className={style.l2}>
						<ToggleSwitch label="2" />
					</div>
				</div>
			</div>
			{/* f4 */}
			<div className={style.f4}>
				<div className={style.left}>
					<div>Stress level : </div>
					<div>
						Stressed <img src={sad} />{" "}
					</div>
				</div>
				<div className={style.right}>
					<div className={style.l1}>
						<div>Feeling exhausted? </div>
						<div>Talking to someone might help you to feel better.</div>
					</div>
					<div className={style.l2}>
						<div>Join our Discord to talk to someone</div>
						<div>
							Find quick resources to refresh <img src={arrow} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
