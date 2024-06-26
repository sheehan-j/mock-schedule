import { useState, useEffect, useRef } from "react";
import { Map, Marker, useMap, useMarkerRef } from "@vis.gl/react-google-maps";
import PropTypes from "prop-types";
import { TextbooksApi } from "../api/TextbooksApi";
// import Map from "./Map";

const SlidingSidebar = ({ isClassClicked, setIsClassClicked, cell }) => {
	const handleMinimize = () => {
		setIsClassClicked(false);
	};
	const [mapConatinerWidth, setMapContainerWidth] = useState(0);
	const [iframeUrl, setIframeUrl] = useState("https://campusmap.ufl.edu/#/");
	const [textbooks, setTextbooks] = useState([]);
	const [loadingTextbooks, setLoadingTextbooks] = useState(false);
	const mapContainerRef = useRef(null);
	const map = useMap();

	useEffect(() => {
		const handleResize = () => {
			if (mapContainerRef.current) {
				setMapContainerWidth(mapContainerRef.current.offsetWidth);
			}
		};
		window.addEventListener("resize", handleResize);
		handleResize();
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (!map) return;

		if (cell?.building?.lat && cell?.building?.long) {
			map.setCenter({ lat: cell?.building?.lat, lng: cell?.building?.long });
			map.setZoom(18);
		}
		const getTextbooks = async (section) => {
			setLoadingTextbooks(true);
			const response = await TextbooksApi.getTextbooksBySection(section);
			setTextbooks(response);
			setLoadingTextbooks(false);
		};

		setTextbooks([]);
		setIframeUrl(
			cell?.building?.bid ? `https://campusmap.ufl.edu/#/${cell?.building?.bid}` : "https://campusmap.ufl.edu/#/"
		);
		if (cell?.number) getTextbooks(cell.number);
	}, [map, cell]);

	const renderStars = (numStars) => {
		const roundedStars = Math.round(numStars * 2) / 2;
		const wholeStars = Math.floor(roundedStars);
		const hasHalfStar = roundedStars % 1 !== 0 && roundedStars % 1 >= 0.25 && roundedStars % 1 < 0.75;
		const stars = [];
		for (let i = 0; i < wholeStars; i++) {
			stars.push(<img key={"star" + i} src="/star.svg" alt="Star" />);
		}
		if (hasHalfStar) {
			stars.push(<img key="half-star" src="/halfStar.svg" alt="Half Star" />);
		}
		return <span className="flex">{stars}</span>;
	};
	return (
		<div
			style={{
				transition: "right 0.5s linear",
				right: isClassClicked ? "0" : "-100%",
			}}
			className="w-10/12 md:w-5/12 xl:w-4/12 z-40 absolute top-0 py-3 overflow-y-scroll h-full bg-customGray flex flex-col border-l border-gray-400"
		>
			<div className="px-2 mb-2" onClick={handleMinimize}>
				<img className="hover:cursor-pointer" src="/remove.svg" />
			</div>
			<div className="px-3 mb-3">
				<div className="border border-gray-300 bg-white pb-3 flex flex-col">
					<div
						className="font-semibold relative px-2 py-2 leading-6"
						style={{ backgroundColor: cell?.color }}
					>
						<div
							className="absolute left-0 top-0 w-1 h-full"
							style={{ backgroundColor: cell?.color }}
						></div>
						{cell?.code} - {cell?.title}
					</div>
					<div className="px-3 py-2 text-sm flex flex-col gap-2">
						<div className="mb-3" style={{ fontSize: "0.81rem", lineHeight: "1.1rem" }}>
							{cell?.description}
						</div>
						<div className="flex flex-row gap-2 justify-between items-center">
							<div className="font-semibold">Instructor</div>
							<div className="text-end">{cell?.instructor}</div>
						</div>
						<div className="flex flex-row gap-2 justify-between items-center">
							<div className="font-semibold">Location</div>
							<div className="text-end">{cell?.location}</div>
						</div>
						<div className="flex flex-row gap-2 justify-between items-center">
							<div className="font-semibold">Prereqs</div>
							<div className="text-end">{cell?.prerequisites == null ? "None" : cell?.prerequisites}</div>
						</div>
						<div className="flex flex-row gap-2 justify-between items-center">
							<div className="font-semibold">Credits</div>
							{cell?.credits && (
								<div className="text-end">{cell?.credits == 0 ? "VAR" : cell?.credits}</div>
							)}
						</div>
						{cell?.final && (
							<div className="flex flex-row gap-2 justify-between items-center">
								<div className="font-semibold">Final Exam</div>
								<div className="text-end">{cell?.final}</div>
							</div>
						)}
						{cell?.department && (
							<div className="flex flex-row gap-2 justify-between items-center">
								<div className="font-semibold">Department</div>
								<div className="text-end">{cell?.department}</div>
							</div>
						)}
						{cell?.rmpData && (
							<>
								<div className="w-full bg-gray-300 my-3" style={{ height: "1px" }}></div>
								<div className="font-semibold w-full">RMP Data</div>
								<div className="flex flex-row gap-2 justify-between items-center">
									<div className="text-end flex flex-col items-center">
										{" "}
										<span>
											<span className="font-semibold mr-1">Rating: </span>{" "}
											{JSON.stringify(cell.rmpData.rating)} / 5
										</span>{" "}
										<span className="ml-2 ">{renderStars(cell.rmpData.rating)}</span>
									</div>
									<div className="text-end">
										{" "}
										<span className="font-semibold">Difficulty: </span>
										{JSON.stringify(cell.rmpData.difficulty)} / 5
									</div>
									<div className="text-end text-blue-700">
										{" "}
										<a href={`https://www.ratemyprofessors.com/professor/${cell.rmpData.rmpId}`}>
											Link to RMP
										</a>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
			<div className="px-3 mb-3">
				<div className="border border-gray-300 bg-white flex flex-col">
					<div
						className="font-semibold relative px-2 py-2 leading-6"
						style={{ backgroundColor: cell?.color }}
					>
						<div
							className="absolute left-0 top-0 w-1 h-full"
							style={{ backgroundColor: cell?.color }}
						></div>
						Textbooks
					</div>
					{textbooks.length > 0 ? (
						<div className="px-3 py-3 text-sm flex flex-col gap-4">
							{textbooks.map((textbook, index) => (
								<div key={textbook.title} className="flex flex-col gap-2">
									{index > 0 && <div className="w-full bg-black" style={{ height: "0.05rem" }}></div>}
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">Title</div>
										<div className="text-end">{textbook?.title}</div>
									</div>
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">ISBN</div>
										<div className="text-end">{textbook?.isbn}</div>
									</div>
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">Author</div>
										<div className="text-end">{textbook?.author}</div>
									</div>
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">New Retail Price</div>
										<div className="text-end">{textbook?.newretailprice}</div>
									</div>
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">Used Retail Price</div>
										<div className="text-end">{textbook?.usedretailprice}</div>
									</div>
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">New Rental Fee</div>
										<div className="text-end">{textbook?.newrentalfee}</div>
									</div>
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">Used Rental Fee</div>
										<div className="text-end">{textbook?.usedrentalfee}</div>
									</div>
									<div className="flex flex-row gap-2 justify-between items-center">
										<div className="font-semibold">Required</div>
										<div className="text-end">{textbook?.textis === "REQUIRED" ? "Yes" : "No"}</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="px-3 py-2 text-sm flex flex-col gap-2">
							<div className="font-semibold">
								{loadingTextbooks ? "Loading Textbooks..." : "No Information Available"}
							</div>
						</div>
					)}
				</div>
			</div>
			{!cell?.isOnline && (
				<div ref={mapContainerRef} className="mx-3 border border-gray-300">
					<Map
						style={{ height: mapConatinerWidth * (2 / 3), width: "100%" }}
						defaultCenter={{ lat: 0, lng: 0 }}
						defaultZoom={10}
						disableDefaultUI={true}
					/>
				</div>
			)}
		</div>
	);
};

SlidingSidebar.propTypes = {
	isClassClicked: PropTypes.bool.isRequired,
	setIsClassClicked: PropTypes.func.isRequired,
};

export default SlidingSidebar;
