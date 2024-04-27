import { useState, useRef, useEffect } from "react";
import { SchedulesApi } from "../api/SchedulesApi";
import MyScheduleBox from "./MyScheduleBox";
import { DistanceUtil } from "../../util/DistanceUtil";
import { useAuth } from "../hooks/AuthProvider";

const MySchedules = ({
	schedules,
	setSchedules,
	activeSchedule,
	setActiveSchedule,
	activeClass,
	setActiveClass,
	classResults,
	setClassResults,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const schedulesMenuRef = useRef(null);
	const auth = useAuth();

	const handleNewSchedule = async () => {
		const newScheduleNumber = schedules.length + 1;
		const newSchedules = await SchedulesApi.createSchedule(`Schedule ${newScheduleNumber}`, auth.user._id);
		if (newSchedules.length == schedules.length + 1) setActiveSchedule(newSchedules[newSchedules.length - 1]);
		setSchedules(newSchedules);
		setActiveClass("");
		setClassResults([]);
	};

	const handleDeleteSchedule = async (id) => {
		const newSchedules = await SchedulesApi.deleteSchedule(id);
		setActiveSchedule(newSchedules.length > 0 ? newSchedules[newSchedules.length - 1] : {});
		setSchedules(newSchedules);
		setActiveClass("");
		setClassResults([]);
	};

	const handleSelectSchedule = async (schedule) => {
		const newActiveSchedule = await DistanceUtil.updateScheduleWithDistances(schedule);
		setActiveSchedule(newActiveSchedule);
		// TODO: Decide whether to automatically select an active class or set it to none
		// setActiveClass(schedule.classes.length > 0 ? schedule.classes[0] : {});
		setActiveClass("");
		setClassResults([]);
	};

	// Update the maxHeight of the schedule menu
	useEffect(() => {
		updateMenuHeight();
	}, [isCollapsed, schedules]);

	const updateMenuHeight = () => {
		if (isCollapsed) {
			schedulesMenuRef.current.style.maxHeight = "0px";
		} else {
			const children = schedulesMenuRef.current.children;
			let totalHeight = 0;
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				const computedStyle = window.getComputedStyle(child);
				const marginTop = parseInt(computedStyle.marginTop);
				const marginBottom = parseInt(computedStyle.marginBottom);
				totalHeight += child.offsetHeight + marginTop + marginBottom;
			}
			schedulesMenuRef.current.style.maxHeight = `${totalHeight}px`;
		}
	};

	return (
		<div className="w-full">
			<div className="relative py-3 px-4 mb-3 bg-white border-gray-300 border shadow-lg h-fit">
				<div
					className="flex items-center justify-between cursor-pointer"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					<p>My Schedules</p>
					<img src="/folder.svg" style={{ height: "1.3rem" }} />
				</div>
				<div
					className="overflow-hidden mb-3"
					ref={schedulesMenuRef}
					style={{
						transition: "all 0.1s linear",
					}}
				>
					{schedules.length > 0 &&
						schedules.map((schedule, index) => (
							<MyScheduleBox
								key={index}
								schedule={schedule}
								selected={activeSchedule._id == schedule._id}
								onSelect={handleSelectSchedule}
								onDelete={handleDeleteSchedule}
							/>
						))}
					<button
						className="px-4 py-1 my-2 block flex justify-center text-center mx-auto bg-white border border-gray-400 rounded-full"
						onClick={handleNewSchedule}
					>
						New Schedule
					</button>
				</div>
				<button
					className="w-full flex items-center justify-center py-1.5 mt-2"
					onClick={() => setIsCollapsed(!isCollapsed)}
					style={{ backgroundColor: "rgb(220, 220, 220)", borderRadius: "0.2rem" }}
				>
					{isCollapsed ? (
						<img src="expand.svg" style={{ height: "0.5rem" }}></img>
					) : (
						<img src="collapse_vertical.svg" style={{ height: "0.5rem" }}></img>
					)}
				</button>
			</div>
			<div className="flex justify-center w-full mb-4">
				<div className="flex justify-center text-center p-1 bg-white rounded-full w-10/12 shadow-lg">
					{activeSchedule?.name ? activeSchedule.name : "No Schedule Selected"}
				</div>
			</div>
		</div>
	);
};

export default MySchedules;
