import "./App.css";
import { useState } from "react";
import * as React from "react";

type Field = [
	[number, number, number],
	[number, number, number],
	[number, number, number],
];

const checkIsWin = (data: Field) => {
	const case1 = data.some((el) => {
		const canWinEl = el[0];
		if (canWinEl > 0) {
			return el.filter((e) => canWinEl === e).length === 3;
		}
		return false;
	});

	let case2 = false;
	const central = data[1][1];

	if (central > 0) {
		if (central === data[0][0] && central === data[2][2]) {
			case2 = true;
		}
		if (central === data[0][2] && central === data[2][0]) {
			case2 = true;
		}
	}

	let case3 = false;

	for (let i = 0; i < 3; i++) {
		if (!case3) {
			const column = data.reduce((acc, el) => {
				const value = el[i];
				if (value > 0) {
					acc.push(value);
				}

				return acc;
			}, [] as number[]);

			if (column.length === 3) {
				case3 = column[0] === column[1] && column[1] === column[2];
			}
		}
	}

	console.log("11111", case1, case2, case3);
	return case1 || case2 || case3;
};

const DEFAULT_FIELD: Field = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

export function App() {
	const [isWin, setIsWin] = useState<boolean | null>(null);
	const [winPlayer, setWinPlayer] = useState<number | null>(null);
	const [player, setPlayer] = useState<1 | 2 | null>(null);
	const [data, setData] = useState<Field>(DEFAULT_FIELD);

	const handleSwitchPlayer = () => setPlayer((prev) => (prev === 1 ? 2 : 1));

	const onRowClick = (e: React.MouseEvent<Event, MouseEvent>) => {
		if (player) {
			const [x, y] = e.target.dataset.position.split("-");
			const noValue = +e.target.dataset.value === 0;

			if (noValue) {
				handleSwitchPlayer();

				setData((prev) => {
					const copy = structuredClone(prev);

					copy[x][y] = player;

					if (checkIsWin(copy)) {
						setIsWin(true);
						setWinPlayer(player);
					}

					return copy;
				});
			}
		}
	};

	const resetGame = () => {
		setIsWin(null);
		setData(DEFAULT_FIELD);
		setPlayer(1);
	};

	const isEndGame = !data.flat().some((el) => el === 0);

	if (isEndGame) {
		return (
			<div className="flex">
				<h2>НИЧЬЯ</h2>
				<button type="button" onClick={resetGame}>
					reset
				</button>
			</div>
		);
	}

	if (isWin) {
		return (
			<div className="flex">
				<h2> WIN {winPlayer} PLAYER</h2>
				<button type="button" onClick={resetGame}>
					reset
				</button>
			</div>
		);
	}

	if (player) {
		return (
			<>
				<h1>Player {player}</h1>
				<div className="container">
					<table className="table" onClick={onRowClick}>
						<tbody>
							{data.map((item, i) => (
								<tr key={`row-${i}`}>
									{(["0", "1", "2"] as const).map((col) => {
										const value = item[col];
										return (
											<td
												key={`col-${col}`}
												data-position={`${i}-${col}`}
												data-value={value}
											>
												{value > 0 ? (value === 1 ? "X" : "O") : null}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}
	return (
		<button type="button" onClick={resetGame}>
			New Game
		</button>
	);
}
