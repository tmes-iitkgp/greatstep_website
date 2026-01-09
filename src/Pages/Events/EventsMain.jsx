import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const EventsMain = (props) => {
	const activeStyle = "change-active changebutton";
	const inactiveStyle = "changebutton";
	const [active, setActive] = React.useState(0);
	const location = useLocation();

	const startRef = React.useRef(null);

	React.useEffect(() => {
		if (location.pathname === "/great-step/events")
			startRef.current.click();
	});

	return (
		<div className="events">
			<div className="events_second">
				<Link
					to="/great-step/events/competitions"
					onClick={() => setActive(0)}
					ref={startRef}
				>
					<div
						className={active === 0 ? activeStyle : inactiveStyle}
						id="button-2"
					>
						<div id="slide"></div>
						<span>Competitions</span>
					</div>
				</Link>
				<Link
					to="/great-step/events/workshops"
					onClick={() => setActive(1)}
				>
					<div
						className={active === 1 ? activeStyle : inactiveStyle}
						id="button-2"
					>
						<div id="slide"></div>
						<span>Workshops</span>
					</div>
				</Link>
				<Link
					to="/great-step/events/panel-discussion"
					onClick={() => setActive(2)}
				>
					<div
						className={active === 2 ? activeStyle : inactiveStyle}
						id="button-2"
					>
						<div id="slide"></div>
						<span>Panel Discussion</span>
					</div>
				</Link>
			</div>
			<Outlet />
		</div>
	);
};

export default EventsMain;
