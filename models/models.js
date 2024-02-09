const path = require("path");

const createConnection = require(path.resolve(__dirname, "../database"));
const db = createConnection();

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected to mySql as id " + db.threadId);
});

module.exports = class Model {
  constructor() {}

  user(username) {
    return new Promise(async (resolve, reject) => {
      db.query(
        "SELECT * FROM `users` WHERE username = ?",
        [username],
        (error, result) => {
          if (error) reject(error);
          else resolve(result[0]);
        }
      );
    });
  }

  addLog(user) {
    return new Promise(async (resolve, reject) => {
      db.query(
        "INSERT INTO `login_logs` (`username`,`login_time`) VALUES (?,NOW())",
        user,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }

  getAll(table) {
    return new Promise(async (resolve, reject) => {
      db.query("SELECT * FROM ??", [table], (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  search(table, field, value) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM ?? WHERE ?? = ?",
        [table, field, value],
        (error, result) => {
          if (error) {
            console.error(
              error + "Error at the search method from the Model class."
            );
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  addDevice(data) {
    return new Promise(async (resolve, reject) => {
      if (await Model.isDuplicate(data)) {
        resolve("duplicate");
      } else {
        db.query(
          "INSERT INTO `devices` (`tag`, `name`, `type`, `service_tag`, `description`) VALUES (?,?,?,?,?)",
          [data.tag, data.name, data.type, data.service_tag, data.description],
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      }
    });
  }

  addEmployee(data) {
    return new Promise(async (resolve, reject) => {
      if (await Model.isDuplicateEmployee(data)) {
        resolve("duplicate");
      } else {
        db.query(
          "INSERT INTO `employees` (`last_name`, `first_name`, `marca`,`department`,`function`) VALUES (?,?,?,?,?)",
          [
            data.last_name,
            data.first_name,
            data.marca,
            data.department,
            data.function,
          ],
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      }
    });
  }

  getEmployeeNames() {
    return new Promise(async (resolve, reject) => {
      db.query(
        "SELECT last_name , first_name , marca FROM employees",
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
  }

  getEmployeeDetails(marca) {
    return new Promise(async (resolve, reject) => {
      db.query(
        "SELECT * FROM employees WHERE marca = ?",
        marca,
        (error, result) => {
          if (error) reject(error);
          else resolve(result[0]);
        }
      );
    });
  }

  getAssignedDevices(marca) {
    return new Promise(async (resolve, reject) => {
      db.query(
        "SELECT * FROM employee_devices WHERE marca = ?",
        marca,
        (error, result) => {
          if (error) reject(error);
          else {
            var arr = [];
            if (result.length > 0) {
              result.forEach((row) => {
                db.query(
                  "SELECT * FROM devices WHERE id = ?",
                  row.id,
                  (error, resultTwo) => {
                    if (error) reject(error);
                    else {
                      arr.push(resultTwo[0]);
                      if (arr.length === result.length) {
                        resolve(arr);
                      }
                    }
                  }
                );
              });
            } else {
              resolve(arr);
            }
          }
        }
      );
    });
  }

  assignDevice(data) {
    return new Promise(async (resolve, reject) => {
      db.query(
        "INSERT INTO employee_devices (marca,id,date_in) VALUES (?,?,?)",
        [data.marca, data.id, Model.todayISO()],
        (error) => {
          if (error) reject(error);
          else {
            resolve(true);
          }
        }
      );
    });
  }

  unassignDevice(value) {
    return new Promise(async (resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(err);
        else {
          db.query(
            "SELECT * FROM `employee_devices` WHERE id = ?",
            value,
            (error, resultOne) => {
              if (error)
                db.rollback(() => {
                  reject(error);
                });
              else {
                db.query(
                  "SELECT * FROM `archive` WHERE `marca` = ? AND `id` = ? AND `date_in` = ? AND `date_out` = ?",
                  [
                    resultOne[0].marca,
                    resultOne[0].id,
                    resultOne[0].date_in,
                    Model.todayISO(),
                  ],
                  (error, resultTwo) => {
                    if (error) {
                      db.rollback(() => {
                        reject(error);
                      });
                    } else {
                      if (resultTwo.length === 0) {
                        db.query(
                          "INSERT INTO `archive` (marca,id,date_in,date_out) VALUES (?,?,?,?)",
                          [
                            resultOne[0].marca,
                            resultOne[0].id,
                            resultOne[0].date_in,
                            Model.todayISO(),
                          ],
                          (err) => {
                            if (err)
                              db.rollback(() => {
                                reject(err);
                              });
                            else {
                              db.query(
                                "DELETE FROM `employee_devices` WHERE id = ?",
                                value,
                                (err) => {
                                  if (err)
                                    db.rollback(() => {
                                      reject(err);
                                    });
                                  else {
                                    db.commit((err) => {
                                      if (err)
                                        db.rollback(() => {
                                          reject(error);
                                        });
                                      else resolve(true);
                                    });
                                  }
                                }
                              );
                            }
                          }
                        );
                      } else {
                        db.query(
                          "DELETE FROM `employee_devices` WHERE id = ?",
                          value,
                          (err) => {
                            if (err)
                              db.rollback(() => {
                                reject(err);
                              });
                            else {
                              db.commit((err) => {
                                if (err)
                                  db.rollback(() => {
                                    reject(err);
                                  });
                                else resolve(true);
                              });
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            }
          );
        }
      });
    });
  }

  deleteDevice(value) {
    return new Promise(async (resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(err);
        db.query(
          "SELECT * FROM employee_devices WHERE id = ?",
          value,
          (error, result) => {
            if (error)
              db.rollback(() => {
                reject(error);
              });
            if (result.length > 0) {
              db.query(
                "INSERT INTO `archive` (`marca`,`id`,`date_in`,`date_out`) VALUES (?,?,?,?)",
                [
                  result[0].marca,
                  result[0].id,
                  result[0].date_in,
                  Model.todayISO(),
                ],
                (err) => {
                  if (err)
                    db.rollback(() => {
                      reject(error);
                    });
                  db.query(
                    "DELETE FROM employee_devices WHERE id = ?",
                    value,
                    (error) => {
                      if (error)
                        db.rollback(() => {
                          reject(error);
                        });
                      db.query(
                        "DELETE FROM devices WHERE id = ?",
                        value,
                        (err) => {
                          if (err)
                            db.rollback(() => {
                              reject(err);
                            });
                          db.commit((err) => {
                            if (err)
                              db.rollback(() => {
                                reject(err);
                              });
                            resolve(true);
                          });
                        }
                      );
                    }
                  );
                }
              );
            } else {
              db.query("DELETE FROM devices WHERE id=?", value, (err) => {
                if (err)
                  db.rollback(() => {
                    reject(err);
                  });
                db.commit((error) => {
                  if (error)
                    db.rollback(() => {
                      reject(error);
                    });
                  resolve(true);
                });
              });
            }
          }
        );
      });
    });
  }

  deleteEmployee(value) {
    return new Promise(async (resolve, reject) => {
      db.beginTransaction((err) => {
        if (err) reject(err);
        db.query(
          "SELECT * FROM employee_devices WHERE marca = ?",
          value,
          (error, result) => {
            if (error)
              db.rollback(() => {
                reject(error);
              });
            if (result.length > 0) {
              db.query(
                "INSERT INTO `archive` (`marca`,`id`,`date_in`,`date_out`) VALUES (?,?,?,?)",
                [
                  result[0].marca,
                  result[0].id,
                  result[0].date_in,
                  Model.todayISO(),
                ],
                (err) => {
                  if (err)
                    db.rollback(() => {
                      reject(error);
                    });
                  db.query(
                    "DELETE FROM employee_devices WHERE marca = ?",
                    value,
                    (error) => {
                      if (error)
                        db.rollback(() => {
                          reject(error);
                        });
                      db.query(
                        "DELETE FROM employees WHERE marca = ?",
                        value,
                        (err) => {
                          if (err)
                            db.rollback(() => {
                              reject(err);
                            });
                          db.commit((err) => {
                            if (err)
                              db.rollback(() => {
                                reject(err);
                              });
                            resolve(true);
                          });
                        }
                      );
                    }
                  );
                }
              );
            } else {
              db.query("DELETE FROM employees WHERE marca=?", value, (err) => {
                if (err)
                  db.rollback(() => {
                    reject(err);
                  });
                db.commit((error) => {
                  if (error)
                    db.rollback(() => {
                      reject(error);
                    });
                  resolve(true);
                });
              });
            }
          }
        );
      });
    });
  }

  static isDuplicate(data) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM `devices` WHERE tag = ? OR service_tag = ?";
      db.query(query, [data.tag, data.service_tag], (error, result) => {
        if (error) reject(error);
        else resolve(result.length > 0);
      });
    });
  }

  static isDuplicateEmployee(data) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM `employees` WHERE marca = ?";
      db.query(query, [data.marca], (error, result) => {
        if (error) reject(error);
        else resolve(result.length > 0);
      });
    });
  }

  // static todayISO() {
  //   const today = new Date();

  //   today.setUTCHours(today.getUTCHours() + 3);
  //   const todayISO = today.toISOString().split('T')[0];

  //   return todayISO;
  // }

  static todayISO() {
    const today = new Date();
    today.setHours(today.getHours() + 2);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayISO = `${year}-${month}-${day}`;
    return todayISO;
  }
};
