import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "_store";

export { Audit };

function sortData(data, sortKey, sortOrder) {
  if (!sortKey) return data;
  const sortedData = data?.sort((a, b) => {
    return a[sortKey] > b[sortKey] ? 1 : -1;
  });
  if (sortOrder === "desc") {
    return sortedData?.reverse();
  }
  return sortedData;
}
function SortButton(sortOrder) {
  console.log(sortOrder);

  return (
    <button
      style={{ border: "none", marginLeft: "6px" }}
      onClick={sortOrder.onClick}
    >
      {" "}
      &#916;
    </button>
  );
}

function Audit() {
  const users = useSelector((x) => x.users.list);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = users?.value?.slice(startIndex, endIndex);
  const [searchItems, setSearchItems] = useState([]);
  const [sortKey, setSortKey] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");

  const headers = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "username", label: "UserName" },
  ];

  const sortedData = useCallback(
    () => sortData(currentItems, sortKey, sortOrder),
    [currentItems, sortKey, sortOrder]
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(users?.value?.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = () => {
    let data = [];
    currentItems &&
      currentItems.filter((item) => {
        if (item.firstName.toLowerCase().indexOf(searchString) >= 0) {
          data.push(item);
          return setSearchItems(data);
        }
        return setSearchItems(currentItems);
      });
  };
  const changeSort = (key) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);
  useEffect(() => {
    setSearchItems(currentItems);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>Auditor Page</h1>
        <div class="input-group" style={{ width: "auto" }}>
          <input
            type="text"
            class="form-control"
            placeholder="username"
            aria-label="username"
            aria-describedby="basic-addon2"
            onChange={(e) => setSearchString(e.target.value)}
          />
          <span
            class="input-group-text"
            id="basic-addon2"
            style={{ cursor: "pointer" }}
            onClick={handleSearch}
          >
            Search
          </span>
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            {headers.map((row, key) => {
              return (
                <th key={row.key} style={{ width: "30%" }}>
                  {row.label}
                  <SortButton
                    columnKey={row.key}
                    onClick={() => changeSort(row.key)}
                    {...{ sortOrder, sortKey }}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData()?.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.username}</td>
            </tr>
          ))}
          {users?.loading && (
            <tr>
              <td colSpan="4" className="text-center">
                <span className="spinner-border spinner-border-lg align-center"></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button type="button" class="btn btn-light" onClick={handlePreviousPage}>
        Previous Page
      </button>
      <button type="button" class="btn btn-light" onClick={handleNextPage}>
        Next Page
      </button>
      <br />
    </div>
  );
}
