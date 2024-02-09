jQuery(function () {
  let devicesTable;
  let employeesTable;
  let currentTable;

  let infoModal = $("#info_modal");
  let modalText = $("#modal_text");

  let editModal = $("#edit_modal");
  let editModalEmployee = $("#edit_modal_employee");
  let editModalContent = $("#edit_modal").find("#edit_modal_content");
  let editModalContentEmployee = $("#edit_modal_employee").find(
    "#edit_modal_content_employee"
  );

  let exportModal = $("#export_modal");
  let exportModalContent = $("#export_modal_content");

  let generateFormModal = $("#generate_form_modal");
  let innerGenerateFormModal = $("#inner_generate_form_modal");

  let selectField;
  let selectedRow;
  let selectedEmployee;
  $("#username").text(`${localStorage.getItem("username")}`);

  function loadAllDevices() {
    $("#table_container").empty();
    $("#table_container").removeClass("table-container-add-device");

    $("#table_container").append(`
        <table class="main-table display cell-border nowrap" id="devices_table">
            <thead class="table-head">
                <tr>
                    <th></th>
                    <th>Status</th>
                    <th>Tag</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Service Tag/IMEI</th>
                    <th>Details</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="table-body">
            </tbody>
        </table>
        `);

    currentTable = devicesTable = $("#devices_table").DataTable({
      ajax: {
        type: "GET",
        url: `/homepage/devices`,
        dataSrc: "",
      },
      deferRender: true,
      fixedHeader: true,
      paging: true,
      scrollCollapse: true,
      scrollY: "685px",
      columns: [
        {
          className: "dt-control",
          orderable: false,
          data: null,
          defaultContent: "",
        },
        {
          data: "status",
          createdCell: function (cell, cellData) {
            $(cell).addClass("round");
            if (cellData === "Taken") {
              $(cell).addClass("Inactive");
            } else if (cellData === "Free") {
              $(cell).addClass("Active");
            }
          },
        },
        { data: "tag" },
        { data: "name" },
        { data: "type" },
        { data: "service_tag" },
        { data: "description" },
        {
          data: null,
          orderable: false,
          defaultContent:
            '<button id="modify_button" class="table-button click-effect table-button-modify"><img src="images/modify_icon.svg"></button><button id="delete_button" class="table-button click-effect table-button-delete"><img src="images/delete_icon.svg"></button>',
          targets: -1,
        },
      ],
    });
  }
  loadAllDevices();

  function addDevices() {
    $("#table_container").empty();
    $("#table_container").addClass("table-container-add-device");

    $("#table_container").append(`
            <div id="form-container" class="form-container">
                <form class="input-form" id="input_form">
                    <label for="tag" class="add-device-label">Tag:<input type="text" name="tag" id="tag" class="device-id inputs" required></label>
                    <label for="name" class="add-device-label">Name:<input type="text" name="name" id="name" class="service-tag inputs" required></label>
                    <label for="type" class="add-device-label">
                        Type:
                        <select name="type" id="type" class="type inputs" required>
                            <option value="Smartphone">Smartphone</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Tablet/Pad">Tablet/Pad</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <label for="service_tag" class="add-device-label">Service Tag:<input type="text" name="service_tag" id="service_tag" class="service-tag inputs"></label>
                    <label for="description" class="add-device-label">Description:<textarea id="description" name="description" class="description inputs" rows="5" cols="21"></textarea></label>
                    <button type="submit" class="submit-button">Submit</button>
                    <label class="add-device-label">(Make sure all data is correct)</label>
                </form>
            </div>
        `);
  }

  function addEmployee() {
    $("#table_container").empty();
    $("#table_container").addClass("table-container-add-device");

    $("#table_container").append(`
            <div id="form-container" class="form-container">
            <form class="input-form" id="input_form_employees">
                <label for="last_name" class="add-device-label">Last Name:<input type="text" pattern="[A-Za-z ]+" name="last_name" id="last_name" class="device-id inputs" required></label>
                <label for="first_name" class="add-device-label">First Name:<input type="text" pattern="[A-Za-z ]+" name="first_name" id="first_name" class="service-tag inputs" required></label>
                <label for="marca" class="add-device-label">Marca:<input type="text" pattern="[0-9]+" name="marca" id="marca" class="service-tag inputs" required></label>
                <label for="department" class="add-device-label">Department:<input type="text" name="department" id="department" class="service-tag inputs" required></label>
                <label for="function" class="add-device-label">Function:<input type="text" name="function" id="function" class="service-tag inputs" required></label>
                <button type="submit" class="submit-button">Submit</button>
                <label class="add-device-label">(Make sure all data is correct)</label>
            </form>
        `);
  }

  function loadEmployees() {
    $("#table_container").empty();
    $("#table_container").removeClass("table-container-add-device");

    $("#table_container").append(`
        <table class="main-table display cell-border nowrap" id="employees_table">
            <thead class="table-head">
                <tr>
                    <th></th>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Mark</th>
                    <th>Department</th>
                    <th>Function</th>
                    <th></th>
                </tr>
            </thead>
            <tbody class="table-body">
            </tbody>
        </table>
        `);

    currentTable = employeesTable = $("#employees_table").DataTable({
      ajax: {
        type: "GET",
        url: `/homepage/employees`,
        dataSrc: "",
      },
      fixedHeader: true,
      paging: 30,
      scrollCollapse: true,
      scrollY: "685px",
      columns: [
        {
          className: "dt-control",
          orderable: false,
          data: null,
          defaultContent: "",
        },
        { data: "last_name" },
        { data: "first_name" },
        { data: "marca" },
        { data: "department" },
        { data: "function" },
        {
          data: null,
          orderable: false,
          defaultContent:
            '<button id="modify_button" class="table-button click-effect table-button-modify"><img src="images/modify_icon.svg"></button><button id="delete_button" class="table-button click-effect table-button-delete"><img src="images/delete_icon.svg"></button>',
          targets: -1,
        },
      ],
    });
  }

  function exportToExcel() {
    $.ajax({
      url: "/export-all-devices",
      method: "get",
      success: function (response) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Devices");
        const columns = [
          { header: "Status", key: "status" },
          { header: "Tag", key: "tag" },
          { header: "Name", key: "name" },
          { header: "Type", key: "type" },
          { header: "Service Tag/IMEI", key: "service_tag" },
          { header: "Description", key: "description" },
        ];

        worksheet.columns = columns;

        // worksheet.addTable({
        //     name: 'MyTable',
        //     ref: 'A1',
        //     headerRow: true,
        //     totalsRow: true,
        //     style: {
        //         theme: 'TableStyleDark3',
        //         showRowStripes: true,
        //     },
        //     columns: columns[0],
        //     rows: response[0]
        // });

        worksheet.addRows(response);

        worksheet.eachRow(function (row, rowNumber) {
          row.eachCell(function (cell, colNumber) {
            cell.font = {
              name: "Calibri",
              size: 12,
              bold: false,
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            if (rowNumber === 1) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD9D9D9" },
              };
              cell.font = {
                name: "Calibri",
                size: 12,
                bold: true,
              };
            }
            if (rowNumber % 2 === 1) {
              if (cell.value === "Free") {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFB2FFB2" },
                };
              } else if (cell.value === "Taken") {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFB2B2" },
                };
                cell.value = "In Use";
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFD9D9D9" },
                };
              }
            } else {
              if (cell.value === "Free") {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFB2FFB2" },
                };
              } else if (cell.value === "Taken") {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFB2B2" },
                };
                cell.value = "In Use";
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFE6E6E6" },
                };
              }
            }
          });
        });

        worksheet.columns.forEach(function (column) {
          let maxWidth = 0;
          column.eachCell(function (cell) {
            const width = cell.value ? cell.value.toString().length : 10;
            if (width > maxWidth) {
              maxWidth = width;
            }
          });
          column.width = maxWidth < 10 ? 10 : maxWidth + 2;
        });

        workbook.xlsx.writeBuffer().then(function (data) {
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `All_Devices_${todayISO()}.xlsx`;
          link.click();
        });
      },
      error: function (error) {
        console.error(error);
        showModal("error");
      },
    });
  }

  function exportFilteredToExcel(data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DevicesByFilter");
    const columns = [
      { header: "Status", key: "status" },
      { header: "Tag", key: "tag" },
      { header: "Name", key: "name" },
      { header: "Type", key: "type" },
      { header: "Service Tag/IMEI", key: "service_tag" },
      { header: "Description", key: "description" },
    ];

    worksheet.columns = columns;

    worksheet.addRows(data);

    // worksheet.addTable({
    //     name: 'MyTable',
    //     ref: 'A1',
    //     headerRow: true,
    //     totalsRow: true,
    //     style: {
    //         theme: 'TableStyleDark3',
    //         showRowStripes: true,
    //     },
    //     columns: columns,
    //     rows: data
    // });

    worksheet.eachRow(function (row, rowNumber) {
      row.eachCell(function (cell, colNumber) {
        cell.font = {
          name: "Calibri",
          size: 12,
          bold: false,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (rowNumber === 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD9D9D9" },
          };
          cell.font = {
            name: "Calibri",
            size: 12,
            bold: true,
          };
        } else if (rowNumber % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6E6E6" },
          };
        }
        if (cell.value === "Free") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFB2FFB2" },
          };
        } else if (cell.value === "Taken") {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFB2B2" },
          };
          cell.value = "In Use";
        }
      });
    });

    worksheet.columns.forEach(function (column) {
      let maxWidth = 0;
      column.eachCell(function (cell) {
        const width = cell.value ? cell.value.toString().length : 10;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });
      column.width = maxWidth < 10 ? 10 : maxWidth + 2;
    });

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DevicesByFilter_${todayISO()}.xlsx`;
      link.click();
    });
  }

  function todayISO() {
    const today = new Date();
    today.setHours(today.getHours() + 2);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayISO = `${day}_${month}_${year}`;
    return todayISO;
  }

  function about() {
    modalText.html(
      "<b>Project Name:</b> User Asset Inventory<br><b>Author:</b> Babtan Mircea<br><b>Documentation:</b><a href='/documentation'>Click me</a>"
    );
    infoModal.show();
  }

  $("#home_button").on("click", function (e) {
    loadAllDevices();
  });

  $("#employees_button").on("click", function (e) {
    loadEmployees();
  });

  $("#add_device_button").on("click", function (e) {
    addDevices();
  });

  $("#add_employee_button").on("click", function (e) {
    addEmployee();
  });

  $("#export_to_excel_button").on("click", function (e) {
    exportModal.show();
  });

  $("#generate_form_button").on("click", function (e) {
    innerGenerateFormModal.html(`
            <label for="select_employee_two" class="select-employee-label">Select employee:</label>
            <select name="select-employee-two" id="select_employee_two" class="select-employee"></select>
            <button id="generate_form_button_two" class="modify-button">Generate form</button>
        `);

    const selectEmployeesTwo = innerGenerateFormModal.find(
      "#select_employee_two"
    );

    selectEmployeesTwo.on("change", function (e) {
      selectedEmployee = e.target.value;
      console.log(selectedEmployee);
    });

    $.ajax({
      url: "/employee-names",
      method: "get",
      success: function (response) {
        response.forEach((item) => {
          const fullName = `${item.last_name} ${item.first_name}`;
          const option = $("<option>").text(fullName).val(item.marca);
          selectEmployeesTwo.append(option);
        });
      },
      error: function (error) {
        console.error(error);
      },
    });

    selectEmployeesTwo.select2({
      placeholder: "Select an employee...",
      width: "100%",
      minimumResultsForSearch: 1,
    });

    generateFormModal.show();
  });

  $("#about_button").on("click", function (e) {
    about();
  });

  $("#logout_button").on("click", function (e) {
    window.location.href = "/logout";
    localStorage.removeItem("username");
  });

  function getDevicesData(paramData) {
    let div = $("<div/>").addClass("loading").text("Loading...");

    let tableHTML = "";
    // let flag = false;

    $.ajax({
      url: "/devices-details",
      data: {
        value: paramData.id,
      },
      dataType: "json",
      success: function (data) {
        if (data.length > 0) {
          tableHTML +=
            '<p class="p-in-table">Current user</p><table class="table-style child-table"><thead><tr><th>Last Name</th><th>First Name</th><th>Marca</th><th>Department</th><th>Function</th><th>Date IN</th></tr></thead><tbody>';

          data.forEach((item) => {
            tableHTML += "<tr>";
            for (const key in item) {
              if (
                item.hasOwnProperty(key) &&
                !(key === "id") &&
                !(key === "date_in")
              ) {
                tableHTML += `<td>${item[key]}</td>`;
              }
            }

            tableHTML += `<td>${parseDate(data[0].date_in)}</td></tr>`;
          });

          tableHTML += "</tbody></table>";

          $.ajax({
            url: "/archive-data",
            data: {
              value: paramData.id,
            },
            dataType: "json",
            success: function (result) {
              if (result.length > 0) {
                tableHTML += '<p class="p-in-table">Previous users</p>';
                tableHTML +=
                  '<table class="table-style child-table"><thead><tr><th>Last Name</th><th>First Name</th><th>Marca</th><th>Department</th><th>Function</th><th>Date IN</th><th>Date OUT</th></tr></thead>';
                result
                  .slice()
                  .reverse()
                  .forEach((item) => {
                    tableHTML += "<tr>";
                    for (const key in item) {
                      if (
                        item.hasOwnProperty(key) &&
                        !(key === "row_id") &&
                        !(key === "date_in") &&
                        !(key === "date_out")
                      ) {
                        tableHTML += `<td>${item[key]}</td>`;
                      }
                    }
                    tableHTML += `<td>${parseDate(
                      item.date_in
                    )}</td><td>${parseDate(item.date_out)}</td></tr>`;
                  });
                tableHTML += "</table>";
              } else {
                tableHTML += "<p>No data available on previous users.</p>";
              }

              div
                .html(tableHTML)
                .removeClass("loading")
                .addClass("table-style");
            },
            error: function () {
              console.error(error);
              div.html("Couldn't load data.").removeClass("loading");
            },
          });
        } else {
          tableHTML += "<p>No current user.</p>";

          $.ajax({
            url: "/archive-data",
            data: {
              value: paramData.id,
            },
            dataType: "json",
            success: function (result) {
              if (result.length > 0) {
                tableHTML += '<p class="p-in-table">Previous users</p>';
                tableHTML +=
                  '<table class="table-style child-table"><thead><tr><th>Last Name</th><th>First Name</th><th>Marca</th><th>Department</th><th>Function</th><th>Date IN</th><th>Date OUT</th></tr></thead>';
                result
                  .slice()
                  .reverse()
                  .forEach((item) => {
                    tableHTML += "<tr>";
                    for (const key in item) {
                      if (
                        item.hasOwnProperty(key) &&
                        !(key === "row_id") &&
                        !(key === "date_in") &&
                        !(key === "date_out")
                      ) {
                        tableHTML += `<td>${item[key]}</td>`;
                      }
                    }
                    tableHTML += `<td>${parseDate(
                      item.date_in
                    )}</td><td>${parseDate(item.date_out)}</td></tr>`;
                  });
              } else {
                tableHTML += "<p>No data available on previous users.</p>";
              }

              div.html(tableHTML).removeClass("loading");
            },
            error: function (error) {
              console.error(error);
              div.html("Couldn't load data.").removeClass("loading");
            },
          });
        }
      },
      error: function (error) {
        console.error(error);
        div.html("Couldn't load data.").removeClass("loading");
      },
    });

    return div;
  }

  function getEmployeesData(paramData) {
    let div = $("<div/>").addClass("loading").text("Loading...");

    let tableHTML = "";

    $.ajax({
      url: "/employees-details",
      data: {
        value: paramData.marca,
      },
      dataType: "json",
      success: function (data) {
        if (data.length > 0) {
          tableHTML += '<p class="p-in-table">Current devices</p>';
          tableHTML +=
            '<table class="table-style child-table"><thead><tr><th>Tag</th><th>Name</th><th>Type</th><th>Service Tag</th><th>Description</th><th>Date IN</th></tr></thead><tbody>';
          data.forEach((item) => {
            tableHTML += "<tr>";
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                if (key === "date_in") {
                  tableHTML += `<td>${parseDate(item[key])}</td>`;
                } else if (!(key === "id")) {
                  tableHTML += `<td>${item[key]}</td>`;
                }
              }
            }
            tableHTML += `</tr>`;
          });
          tableHTML += "</tbody></table>";

          $.ajax({
            url: "/archive-data-employees",
            data: {
              value: paramData.marca,
            },
            dataType: "json",
            success: function (result) {
              if (result.length > 0) {
                tableHTML += '<p class="p-in-table">Previous devices</p>';
                tableHTML +=
                  '<table class="table-style child-table"><thead><tr><th>Tag</th><th>Name</th><th>Type</th><th>Service Tag</th><th>Description</th><th>Date IN</th><th>Date OUT</th></tr></thead><tbody>';
                result
                  .slice()
                  .reverse()
                  .forEach((item) => {
                    tableHTML += "<tr>";
                    for (const key in item) {
                      if (item.hasOwnProperty(key)) {
                        if (key === "date_in" || key === "date_out") {
                          tableHTML += `<td>${parseDate(item[key])}</td>`;
                        } else if (!(key === "id")) {
                          tableHTML += `<td>${item[key]}</td>`;
                        }
                      }
                    }
                    tableHTML += `</tr>`;
                  });
                tableHTML += "</tbody></table>";
              } else {
                tableHTML += "<p>No data available on previous devices.</p>";
              }

              div
                .html(tableHTML)
                .removeClass("loading")
                .addClass("table-style");
            },
          });
        } else {
          tableHTML += "<p>No current device.</p>";

          $.ajax({
            url: "/archive-data-employees",
            data: {
              value: paramData.marca,
            },
            dataType: "json",
            success: function (result) {
              if (result.length > 0) {
                tableHTML += '<p class="p-in-table">Previous devices</p>';
                tableHTML +=
                  '<table class="table-style child-table"><thead><tr><th>Tag</th><th>Name</th><th>Type</th><th>Service Tag</th><th>Description</th><th>Date IN</th><th>Date OUT</th></tr></thead><tbody>';
                result
                  .slice()
                  .reverse()
                  .forEach((item) => {
                    tableHTML += "<tr>";
                    for (const key in item) {
                      if (item.hasOwnProperty(key)) {
                        if (key === "date_in" || key === "date_out") {
                          tableHTML += `<td>${parseDate(item[key])}</td>`;
                        } else if (!(key === "id")) {
                          tableHTML += `<td>${item[key]}</td>`;
                        }
                      }
                    }
                    tableHTML += `</tr>`;
                  });
                tableHTML += "</tbody></table>";
              } else {
                tableHTML += "<p>No data available on previous devices.</p>";
              }

              div
                .html(tableHTML)
                .removeClass("loading")
                .addClass("table-style");
            },
            error: function (error) {
              console.error(error);
              div
                .html("Couldn't load data(Server error).")
                .removeClass("loading");
            },
          });
        }
      },
      error: function (error) {
        console.error(error);
        div.html("Couldn't load data(Server error).").removeClass("loading");
      },
    });

    return div;
  }

  $("#table_container").on(
    "click",
    "#devices_table td.dt-control",
    function (e) {
      e.preventDefault();
      let tr = e.target.closest("tr");
      let row = devicesTable.row(tr);

      if (row.child.isShown()) {
        row.child.hide();
      } else {
        row.child(getDevicesData(row.data())).show();
      }
    }
  );

  $("#table_container").on(
    "click",
    "#employees_table td.dt-control",
    function (e) {
      let tr = e.target.closest("tr");
      let row = employeesTable.row(tr);

      if (row.child.isShown()) {
        row.child.hide();
      } else {
        row.child(getEmployeesData(row.data())).show();
      }
    }
  );

  function parseDate(data) {
    const parsedDate = Date.parse(data);
    const isValidDate = !isNaN(parsedDate);
    if (isValidDate) {
      const date = new Date(parsedDate);
      date.setUTCHours(date.getUTCHours() + 3);
      const formattedDate = date.toISOString().split("T")[0];
      return formattedDate;
    }
    return "-";
  }

  $("#table_container").on(
    "click",
    "#devices_table #modify_button",
    function () {
      let tr = $(this).closest("tr");
      let row = devicesTable.row(tr);

      loadModalContent(row.data());

      selectedRow = row;

      editModal.show();
    }
  );

  $("#table_container").on(
    "click",
    "#employees_table #modify_button",
    function () {
      let tr = $(this).closest("tr");
      let row = employeesTable.row(tr);

      loadModalContentEmployee(row.data());

      selectedRow = row;

      editModalEmployee.show();
    }
  );

  editModalContent.on("click", "#assign_employee_button", function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/assign-device",
      data: {
        id: selectedRow.data().id,
        marca: selectField.val(),
      },
      dataType: "json",
      success: function () {
        editModal.hide();
        modalText.text("Operation successful.");
        infoModal.show();

        const cellNode = devicesTable.cell(selectedRow.index(), 1).node();
        const $cell = $(cellNode);
        $cell.removeClass("Active").addClass("Inactive");
        $cell.text("Taken");
        selectedRow.data().status = "Taken";

        loadModalContent(selectedRow.data());

        selectedRow.child(getDevicesData(selectedRow.data())).show();

        selectedRow.draw(false);
      },
      error: function (error) {
        console.error(error);
        modalText.text("An error occured on the server.");
        infoModal.show();
      },
    });
  });

  editModalContent.on("click", "#unassign_device_btn", function (event) {
    $.ajax({
      type: "DELETE",
      url: "/unassign-device",
      data: {
        id: selectedRow.data().id,
      },
      dataType: "json",
      success: function (result) {
        editModal.hide();
        modalText.text("Operation successful.");
        infoModal.show();

        const cellNode = devicesTable.cell(selectedRow.index(), 1).node();
        const $cell = $(cellNode);
        $cell.removeClass("Inactive").addClass("Active");
        $cell.text("Free");
        selectedRow.data().status = "Free";

        loadModalContent(selectedRow.data());
        selectedRow.draw(false);

        selectedRow.child(getDevicesData(selectedRow.data())).show();
      },
      error: function (error) {
        console.error(error);
        modalText.text("An error occured on the server.");
        infoModal.show();
      },
    });
  });

  innerGenerateFormModal.on("click", "#generate_form_button_two", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/employee-names",
      method: "get",
      data: {
        value: selectedEmployee,
      },
      dataType: "json",
      success: function (result) {
        generateFormModal.hide();
        console.log(result);
      },
    });
  });

  function loadModalContent(rowData) {
    if (rowData.status === "Free") {
      editModalContent.html(`
            <label for="select_employee" class="select-employee-label">Select employee to assign:</label>
            <select name="select-employee" id="select_employee" class="select-employee"></select>
            <button id="assign_employee_button" class="modify-button">Assign to selected employee</button>
            `);
      $.ajax({
        url: "/employee-names",
        method: "get",
        success: function (response) {
          response.forEach((item) => {
            const fullName = `${item.last_name} ${item.first_name}`;
            const option = $("<option>").text(fullName).val(item.marca);
            const selectEmployees = editModalContent.find("#select_employee");
            selectEmployees.append(option);
          });
        },
        error: function (error) {
          console.error(error);
        },
      });

      selectField = editModalContent.find("#select_employee");
      selectField.select2({
        placeholder: "Select an employee...",
        width: "100%",
        minimumResultsForSearch: 1,
      });
    } else {
      editModalContent.html(`
                <p class="modify-modal-device-info">
                    <b>Tag:</b>  ${rowData.tag}<br>
                    <b>Name:</b>  ${rowData.name}<br>
                    <b>Service Tag/IMEI:</b>  ${rowData.service_tag}<br><br>
                </p>
                <button class="modify-button" id="unassign_device_btn">Unassign Device</button>
            `);
    }
  }

  function loadModalContentEmployee(rowData) {
    editModalContentEmployee.html(`
            <p class="modify-modal-device-info">
                <b>Last Name:</b>  ${rowData.last_name}<br>
                <b>First Name:</b>  ${rowData.first_name}<br>
                <b>Marca:</b>  ${rowData.marca}<br>
                <b>Department:</b>  ${rowData.department}<br>
                <b>Function:</b>  ${rowData.function}<br><br>
            </p>
        `);

    $.ajax({
      url: "/device-names",
      method: "get",
      data: {
        value: rowData.marca,
      },
      success: function (response) {
        if (response.length > 0) {
          editModalContentEmployee.append(
            `<select name="select_device" id="select_device" class="select-employee"></select>`
          );
          response.forEach((item) => {
            const option = $("<option>")
              .text(item.tag + " // " + item.name + " // " + item.type)
              .val(item.id);
            const selectDevices =
              editModalContentEmployee.find("#select_device");
            selectDevices.append(option);
          });
          editModalContentEmployee.append(
            '<button class ="modify-button" id="unassign_employee_button">Unassign the selected device</button>'
          );
        }
      },
      error: function (error) {
        console.error(error);
      },
    });
  }

  editModalContentEmployee.on(
    "click",
    "#unassign_employee_button",
    function (event) {
      event.preventDefault();
      const value = editModalContentEmployee.find("#select_device").val();
      $.ajax({
        type: "DELETE",
        url: "/unassign-device",
        data: {
          id: value,
        },
        dataType: "json",
        success: function (result) {
          editModalEmployee.hide();
          modalText.text("Operation successful.");
          infoModal.show();
          employeesTable.draw(false);

          selectedRow.child(getEmployeesData(selectedRow.data())).show();
        },
        error: function (error) {
          console.error(error);
          modalText.text("An error occured on the server.");
          infoModal.show();
        },
      });
    }
  );

  $("#table_container").on(
    "click",
    "#devices_table #delete_button",
    function () {
      let tr = $(this).closest("tr");
      $("#confirmation_modal").data("target-row", tr).show();
    }
  );

  $("#table_container").on(
    "click",
    "#employees_table #delete_button",
    function () {
      let tr = $(this).closest("tr");
      $("#confirmation_modal").data("target-row", tr).show();
    }
  );

  function showModal(result) {
    if (result === "duplicate") {
      modalText.text("This device already exists.");
    } else if (result === "error") {
      modalText.text("An error has occurred.");
    } else {
      modalText.text("Device added successfully!");
    }
    infoModal.show();
  }

  function showModalEmployee(result) {
    if (result === "duplicate") {
      modalText.text("This employee already exists.");
    } else if (result === "error") {
      modalText.text("An error has occurred.");
    } else {
      modalText.text("Employee added successfully!");
    }
    infoModal.show();
  }

  infoModal.on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#infoModal").hide();
    }
  });

  $("#modal_close_btn").on("click", function () {
    infoModal.hide();
  });

  $(this).on("click", "#edit_modal #modify_modal_close_btn", function () {
    editModal.hide();
  });

  $(this).on("click", "#export_modal #export_modal_close_btn", function () {
    exportModal.hide();
  });

  $(this).on(
    "click",
    "#generate_form_modal #generate_form_modal_close_btn",
    function () {
      generateFormModal.hide();
    }
  );

  $(this).on(
    "click",
    "#edit_modal_employee #modify_modal_close_btn",
    function () {
      editModalEmployee.hide();
    }
  );

  $(this).on("click", function (event) {
    if (infoModal.is(event.target)) {
      infoModal.hide();
    }
  });

  $("#table_container").on("submit", "#input_form", function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "/add-device",
      data: formData,
      dataType: "json",
      success: (data) => {
        showModal(data);
        $(this)[0].reset();
      },
      error: (error) => {
        showModal("error");
        console.error("Error:", error);
      },
    });
  });

  $("#table_container").on("submit", "#input_form_employees", function (event) {
    event.preventDefault();
    const formData = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "/add-employee",
      data: formData,
      dataType: "json",
      success: (data) => {
        showModalEmployee(data);
        $(this)[0].reset();
      },
      error: (error) => {
        showModal("error");
        console.error("Error:", error);
      },
    });
  });

  $("#confirmation_modal_close_btn").on("click", function () {
    $("#confirmation_modal").hide();
  });

  $("#confirmation_modal").on("click", "#no_button", function () {
    $("#confirmation_modal").hide();
  });

  $("#confirmation_modal").on("click", "#yes_button", function () {
    $("#confirmation_modal").hide();
    let tr = $("#confirmation_modal").data("target-row");
    let row = currentTable.row(tr);
    if (row.data().tag !== undefined) {
      $.ajax({
        url: "/delete-device",
        method: "DELETE",
        data: { value: row.data().id },
        success: function (response) {
          row.remove();
          currentTable.draw(false);
        },
        error: function (error) {
          console.error(error);
          modalText.text("An error occured on the server.");
          infoModal.show();
        },
      });
    } else {
      $.ajax({
        url: "/delete-employee",
        method: "DELETE",
        data: { value: row.data().marca },
        success: function (response) {
          row.remove();
          currentTable.draw(false);
        },
        error: function (error) {
          console.error(error);
          modalText.text("An error occured on the server.");
          infoModal.show();
        },
      });
    }
  });

  $(document).on("keypress", function (event) {
    if (event.key === "Enter") {
      // Enter key
      if ($("#confirmation_modal").is(":visible")) {
        setTimeout(function () {
          $("#yes_button").trigger("click");
        }, 50);
      }

      if (infoModal.is(":visible")) {
        infoModal.hide();
      }
    }
  });

  exportModalContent.on("click", "#export_all_devices_button", () => {
    exportToExcel();
  });

  exportModalContent.on("click", "#export_filtered_devices_button", () => {
    const filteredData = currentTable
      .rows({ filter: "applied", search: "applied" })
      .data()
      .toArray();
    exportFilteredToExcel(filteredData);
  });
});

//TODO:Organize above code in more files.

//TODO:Add export/import to excel for child tables.

//TODO:Add export for form with signature.

//TODO: Add other statuses for devices.
