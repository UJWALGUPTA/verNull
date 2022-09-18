import React, { useEffect, useRef, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import style from "./Camera.module.scss";
import Webcam from "react-webcam";
import check from "../../Assets/check.png";
import wrong from "../../Assets/wrong.png";
import * as tf from "@tensorflow/tfjs";
import * as tmPose from "@teachablemachine/pose";
import l1 from "../../Assets/l1.png";
import l2 from "../../Assets/l2.png";
import l3 from "../../Assets/l3.png";
export default function Camera({ setDailyPush }) {
	const [models, setModels] = useState();
	const [maxPredictions, setMaxPredictions] = useState();
	const [score, setScore] = useState([0, 0]);
	const [interval, setIntervalState] = useState(0);
	const camera = useRef();
	const player = useRef();

	const URL = "https://teachablemachine.withgoogle.com/models/hZpnR1hwj/";
	const videoConstraints = {
		width: 1280,
		height: 720,
		facingMode: "user",
	};

	async function predict(img, check) {
		let prevModels = null;
		setModels((models) => {
			prevModels = models;
			return models;
		});
		if (!prevModels) return;
		const { pose, posenetOutput } = await prevModels.estimatePose(img);
		const prediction = await prevModels.predict(posenetOutput);
		let maxPrediction = 0;
		setMaxPredictions((maxPredictions) => {
			maxPrediction = maxPredictions;
			return maxPredictions;
		});
		for (let i = 0; i < maxPrediction; i++) {
			setScore([
				prediction[1].probability.toFixed(2),
				prediction[0].probability.toFixed(2),
			]);
			console.log(check, check == true);
			if (check == true) {
				let cnt = Number(localStorage.getItem("todaysCnt"));
				if (cnt == undefined) cnt = 1;
				localStorage.setItem("todaysCnt", cnt + 1);
				let daily = localStorage.getItem("dailyPosture");
				if (daily == undefined) daily = JSON.stringify([1]);
				daily = JSON.parse(daily);
				let date = localStorage.getItem("date");
				if (date != new Date().getDate()) {
					localStorage.setItem("date", new Date().getDate());
					daily = [1];
					localStorage.setItem("todaysCnt", 1);
				} else {
					daily.push(prediction[0].probability.toFixed(2));
				}
				setDailyPush(daily);
				localStorage.setItem("dailyPosture", JSON.stringify(daily));
			}
			if (prediction[1].probability.toFixed(2) > 0.9) {
				console.log("bad");
			}
			if (prediction[0].probability.toFixed(2) > 0.8) {
				console.log("good");
			}
		}
	}

	const capture = (check) => {
		if (!camera.current) return;
		const imageSrc = camera.current.getScreenshot();
		if (!camera.current.ctx) return;
		var img = new Image();
		img.src = imageSrc;
		camera.current.ctx.drawImage(img, 0, 0);
		predict(camera.current.canvas, check);

		//Lighthouse deploy call

		dataDeploy(img);
	};

	const dataDeploy = async () => {
		const output = await lighthouse.deploy(
			img,
			"d65f9d14-36b9-447c-a512-6681f7ef80df"
		);
		console.log("File Status:", output);
	};

	const init = async () => {
		const modelURL = URL + "model.json";
		const metadataURL = URL + "metadata.json";
		let models = await tmPose.load(modelURL, metadataURL);
		setModels(models);
		let maxPredictions = models.getTotalClasses();
		setMaxPredictions(maxPredictions);
		let interval = setInterval(capture, 1000);
		setInterval(capture, 1200000, true);
		setIntervalState(interval);
	};

	useEffect(() => {
		init();

		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<>
			<div className={style.f1}>
				<Webcam
					audio={false}
					ref={camera}
					screenshotFormat="image/jpeg"
					videoConstraints={videoConstraints}
					height="260px"
				/>
			</div>
			<div className={style.f2}>
				<div className={style.l1}>Your Current Status</div>
				<div className={style.l2}>
					<div className={style.h1}>
						<div>
							<img src={l1} />
							Posture Correctness:{" "}
						</div>
						<div className={parseInt(score[1] * 100) < 55 ? style.red : ""}>
							{parseInt(score[1] * 100)}%
						</div>
						<div>Ideal Percentage: 95%</div>
						<div className={parseInt(score[1] * 100) < 55 ? style.red : ""}>
							{" "}
							<img src={parseInt(score[1] * 100) < 55 ? wrong : check} />{" "}
							{parseInt(score[1] * 100) < 55 ? "Bad Posture" : "Just right!"}{" "}
						</div>
					</div>
					<div className={style.h2}>
						<div>
							<img src={l2} />
							Posture Correctness:{" "}
						</div>
						<div> {parseInt(score[1] * 100)}%</div>
						<div>Ideal Percentage: 95%</div>
						<div>
							{" "}
							<img src={parseInt(score[1] * 100) < 55 ? wrong : check} /> Just
							right!
						</div>
					</div>
					<div className={style.h3}>
						<div>
							{" "}
							<img src={l3} />
							Posture Correctness:{" "}
						</div>
						<div>87%</div>
						<div>Ideal Percentage: 95%</div>
						<div>
							{" "}
							<img src={check} /> Just right!
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
