import PropTypes from "prop-types";
import { getPeriodTimes } from "../constants/BlockTimes";
import { useRef, useState, useEffect } from "react";

const ClassCell = ({ cell, onCellClick }) => {
	const distanceTooltipRef = useRef(null);
	const cellRef = useRef(null);
	const [distanceHovered, setDistanceHovered] = useState(false);
	const { color, code, instructor, location, length, period, distance } = cell;

	useEffect(() => {
		if (distanceTooltipRef?.current) {
			if (distanceHovered) {
				distanceTooltipRef.current.style.top = "-0.4rem";
				distanceTooltipRef.current.style.opacity = "1";
			} else {
				distanceTooltipRef.current.style.top = "0.7rem";
				distanceTooltipRef.current.style.opacity = "0";
			}
		}
	}, [distanceHovered]);

	const clickClass = () => {
		onCellClick();
	};
	return (
		<div
			// TODO: Remove these overflow classes if possible because they are breaking styling for walking distance
			className={`overflow-hidden sm:overflow-auto z-10 p-1.5 flex flex-col justify-between box-content relative ${
				distance ? "z-20" : "z-10"
			}`}
			style={{ backgroundColor: color, borderWidth: "1px", borderColor: color, cursor: "pointer" }}
			onClick={clickClass}
		>
			<div>
				<div className="font-semibold" style={{ fontSize: "1.05rem", lineHeight: "1.1rem" }}>
					{code}
				</div>
				<div className="hidden sm:block" style={{ fontSize: "0.9rem" }}>
					{instructor}
				</div>
			</div>
			<div
				className="flex justify-between items-end whitespace-normal break-words"
				style={{ fontSize: "0.9rem", lineHeight: "1.2rem" }}
			>
				<div>
					{length && (
						<div>
							<span className="block sm:hidden">{getPeriodTimes(period).start}</span>
							<span className="hidden sm:block">
								{getPeriodTimes(period).start} - {getPeriodTimes(period + length - 1).end}
							</span>
						</div>
					)}
					<div className="font-semibold">{location}</div>
				</div>
				{distance && (
					<div
						className="relative block pb-1.5"
						onMouseEnter={() => setDistanceHovered(true)}
						onMouseLeave={() => setDistanceHovered(false)}
					>
						<p
							ref={distanceTooltipRef}
							className="absolute text-sm text-nowrap bg-white py-0.5 px-2 rounded border-gray-300 border"
							style={{
								left: "50%",
								width: "auto",
								top: "0.7rem", // Animates to -0.3rem
								transform: "translateX(-50%) translateY(-100%)",
								transition: "all 0.15s linear",
								opacity: "0",
							}}
						>
							<span
								className={`font-bold ${
									parseInt(distance.time.substring(0, distance.time.indexOf(" "))) >= 16
										? "text-red-800"
										: "text-lime-600"
								}`}
							>
								{distance.time.substring(0, distance.time.length - 1)}
							</span>{" "}
							walk to {distance.class}
						</p>
						<img src="./walking.svg" className="w-7 h-7" />
						<img
							src="./arrow.svg"
							className="absolute h-8 z-20"
							style={{ left: "50%", bottom: "0.1rem", transform: "translateX(-50%) translateY(100%)" }}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

ClassCell.propTypes = {
	cell: PropTypes.shape({
		color: PropTypes.string,
		code: PropTypes.string,
		instructor: PropTypes.string,
		location: PropTypes.string,
		length: PropTypes.number,
		row: PropTypes.number,
	}).isRequired,
	onCellClick: PropTypes.func.isRequired,
};

export default ClassCell;
