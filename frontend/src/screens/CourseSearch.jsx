import Navbar from "../components/Navbar";
import CourseSearchModal from "../components/courseSearchModal";
import SearchResultBox from "../components/SearchResultBox";
import AddSectionFromSearch from "../components/AddSectionFromSearch";
import { useState, useEffect } from "react";
import { SearchApi } from "../api/SearchApi";
import { SchedulesApi } from "../api/SchedulesApi";
import { useAuth } from "../hooks/AuthProvider";

const CourseSearch = () => {
	const [searchResults, setSearchResults] = useState([]);
	const [titleSearch, setTitleSearch] = useState("");
	const [numberSearch, setNumberSearch] = useState("");
	const [codeSearch, setCodeSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [expanded, setExpanded] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [sectionToAdd, setSectionToAdd] = useState(null);
	const [schedules, setSchedules] = useState([]);
	const auth = useAuth();

	useEffect(() => {
		const loadSchedules = async () => {
			const response = await SchedulesApi.getSchedulesByUser(auth.user._id);
			setSchedules(response);
		};

		if (auth.user) {
			loadSchedules();
		}
	}, [auth]);

	const clearInput = () => {
		if (loading) return;

		setTitleSearch("");
		setNumberSearch("");
		setCodeSearch("");
		setSearchResults([]);
	};

	const handleSearch = async (e) => {
		if (loading) return;
		setLoading(true);

		e.preventDefault();

		let params = {};
		if (titleSearch != "") params = { ...params, title: titleSearch };
		if (numberSearch != "") params = { ...params, number: numberSearch };
		if (codeSearch != "") params = { ...params, class: codeSearch };

		const response = await SearchApi.search(params);
		setSearchResults(response.result);
		setLoading(false);
	};

	const handleKeyPress = async (e) => {
		if (e.key === "Enter") {
			handleSearch(e);
		}
	};

	return (
		<div className="w-full min-h-screen relative">
			<Navbar />
			<div className="content py-6 w-full flex flex-col items-center">
				<div className="w-4/5">
					<div className="flex flex-col lg:flex-row justify-center gap-3 w-full mb-4">
						<div className="flex flex-row grow gap-3">
							<div className="grow">
								<input
									type="text"
									value={codeSearch}
									onChange={(e) => setCodeSearch(e.target.value)}
									onKeyDown={handleKeyPress}
									className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:border-blue-500"
									placeholder="Code (ex. CIS4930)"
								/>
							</div>
							<div className="grow">
								<input
									type="text"
									value={numberSearch}
									onChange={(e) => setNumberSearch(e.target.value)}
									onKeyDown={handleKeyPress}
									className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:border-blue-500"
									placeholder="Number (ex. 12345)"
								/>
							</div>
						</div>
						<div className="flex flex-row grow gap-3">
							<div className="relative grow w-full">
								<input
									type="text"
									value={titleSearch}
									onChange={(e) => setTitleSearch(e.target.value)}
									onKeyDown={handleKeyPress}
									className="w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:border-blue-500"
									placeholder="Course Title (ex. Internet Computing)"
								/>
								{titleSearch != "" && (
									<button
										className="absolute inset-y-0 right-3 flex items-center"
										onClick={clearInput}
									>
										<img src="/remove.svg" />
									</button>
								)}
							</div>
							<button
								className="bg-customBlue hover:bg-customBlue-dark text-white px-10 rounded-lg"
								onClick={handleSearch}
							>
								Search
							</button>
						</div>
					</div>
					<div className="w-full flex flex-col gap-5 justify-center items-center">
						{!loading &&
							searchResults.map((searchResult, index) => (
								<SearchResultBox
									key={searchResult._id}
									searchResult={searchResult}
									expanded={expanded}
									index={index}
									handleClick={() => {
										setExpanded(expanded === searchResult._id ? null : searchResult._id);
									}}
									sectionToAdd={sectionToAdd}
									setSectionToAdd={setSectionToAdd}
									setModalOpen={setModalOpen}
								/>
							))}
						{searchResults.length == 0 && !loading && (
							<div className="text-gray-500">No results found!</div>
						)}
						{loading && <div className="text-gray-500">Loading search results...</div>}
					</div>
				</div>
			</div>
			<AddSectionFromSearch
				schedules={schedules}
				setSchedules={setSchedules}
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				sectionToAdd={sectionToAdd}
			/>
		</div>
	);
};

export default CourseSearch;
