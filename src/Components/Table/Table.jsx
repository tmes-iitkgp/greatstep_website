import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import axios from "axios";
import { useEffect, useState } from "react";

// Code for Pagination
function TablePaginationActions(props) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === "rtl" ? (
					<LastPageIcon />
				) : (
					<FirstPageIcon />
				)}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === "rtl" ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === "rtl" ? (
					<FirstPageIcon />
				) : (
					<LastPageIcon />
				)}
			</IconButton>
		</Box>
	);
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};
export default function CustomPaginationActionsTable() {
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		axios
			.get("/auth/admin/getList", {
				headers: {
					Authorization: JSON.parse(localStorage.getItem("curUser"))
						.token,
				},
			})
			.then((res) => {
				console.log(res.data.users);
				let allUsers = [];
				let response = res.data.users;

				response.map((user) => {
					allUsers.push({
						firstName: user.firstName,
						lastName: user.lastName,
						userName: user.userName,
						email: user.email,
						mobile: user.mobile,
						altEmail: user.altEmail ? user.altEmail : "-",
						altMobile: user.altMobile ? user.altMobile : "-",
					});
				});
				setUsers(allUsers);
			});
	}, []);
	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
				<TableBody>
					<TableRow>
						<TableCell component="th" scope="row">
							FirstName
						</TableCell>
						<TableCell style={{ width: 160 }} align="right">
							LastName
						</TableCell>
						<TableCell style={{ width: 160 }} align="right">
							Username
						</TableCell>
						<TableCell style={{ width: 160 }} align="right">
							Email
						</TableCell>
						<TableCell style={{ width: 160 }} align="right">
							Phone No
						</TableCell>
						<TableCell style={{ width: 160 }} align="right">
							Alt Email
						</TableCell>
						<TableCell style={{ width: 160 }} align="right">
							Alt Phone No
						</TableCell>
						<TableCell style={{ width: 160 }} align="right">
							Actions
						</TableCell>
					</TableRow>
					{(rowsPerPage > 0
						? users.slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
						  )
						: users
					).map((row, idx) => (
						<TableRow key={row.name + idx}>
							<TableCell component="th" scope="row">
								{row.firstName}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{row.lastName}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{row.userName}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{row.email}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{row.mobile}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{row.altEmail}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								{row.altMobile}
							</TableCell>
							<TableCell style={{ width: 160 }} align="right">
								<DeleteIcon />
								<EditSharpIcon />
							</TableCell>
						</TableRow>
					))}

					{emptyRows > 0 && (
						<TableRow style={{ height: 53 * emptyRows }}>
							<TableCell colSpan={6} />
						</TableRow>
					)}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[
								10,
								25,
								{ label: "All", value: -1 },
							]}
							colSpan={3}
							count={users.length}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: {
									"aria-label": "rows per page",
								},
								native: true,
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
}
