const connection = require("./config/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const chalk = require("chalk");
const validate = require("./javascript/validate");

// Database Connect and Starter Title

// .connect() is part of the mysql2 library and is used to establish a connection to the MySQL database.
connection.connect((error) => {
  // a concise way of writing an error-checking statement in JavaScript. It's an "if" statement in a single line, commonly used for quick error handling.
  if (error) throw error;

  console.log(``);

  console.log(
    chalk.green.bold(
      `====================================================================================`
    )
  );
  // Prompt the user for input after a successful connection
  promptUser();
});

// Prompt User for Choices
// .prompt() is a method provided by the inquirer library
const promptUser = () => {
  // The inquirer.prompt() function returns a Promise. Once the user completes the prompts, the Promise is resolved, and the provided .then() callback is executed with the user's answers as the parameter (in this case, it's named answers).
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Please select an option:",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View All Employees By Department",
          "View Department Budgets",
          "Update Employee Role",
          "Update Employee Manager",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Remove Employee",
          "Remove Role",
          "Remove Department",
          "Exit",
        ],
      },
    ])
    // Reminder: .then() is a method used in Promises in JavaScript. It allows you to specify a callback function that will be executed when the Promise is resolved, i.e., when the asynchronous operation is successful.
    // Context: In the context of inquirer.prompt(), it is used to handle the user's input after they've answered the prompts.
    .then((answers) => {
      // a constant variable named choices and assigns it the value of the choices property from the answers
      const choices = answers.choices;

      if (choices === "View All Employees") {
        viewAllEmployees();
      }

      if (choices === "View All Departments") {
        viewAllDepartments();
      }

      if (choices === "View All Employees By Department") {
        viewEmployeesByDepartment();
      }

      if (choices === "Add Employee") {
        addEmployee();
      }

      if (choices === "Remove Employee") {
        removeEmployee();
      }

      if (choices === "Update Employee Role") {
        updateEmployeeRole();
      }

      if (choices === "Update Employee Manager") {
        updateEmployeeManager();
      }

      if (choices === "View All Roles") {
        viewAllRoles();
      }

      if (choices === "Add Role") {
        addRole();
      }

      if (choices === "Remove Role") {
        removeRole();
      }

      if (choices === "Add Department") {
        addDepartment();
      }

      if (choices === "View Department Budgets") {
        viewDepartmentBudget();
      }

      if (choices === "Remove Department") {
        removeDepartment();
      }

      if (choices === "Exit") {
        connection.end();
      }
    });
};

// ----------------------------------------------------- VIEW -----------------------------------------------------------------------

// View All Employees
const viewAllEmployees = async () => {
  try {
    let sql = `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.department_name AS 'department', 
                  role.salary
                  FROM employee, role, department 
                  WHERE department.id = role.department_id 
                  AND role.id = employee.role_id
                  ORDER BY employee.id ASC`;

    //connection -> MySQL database connection object
    // .promise() part of the MySQL2 library
    // connection.promise().query(sql): This is calling the query method on a promise-based version of the MySQL connection (connection.promise()). The query method is used to execute a SQL query on the database.
    // await : The await keyword is used to pause the execution of the asynchronous function until the promise returned by connection.promise().query(sql) is resolved.
    //Destructuring assignment: unpack values from arrays, or properties from objects, into distinct variables.
    // let [a, b] = [4,5]
    const [rows] = await connection.promise().query(sql);

    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` + chalk.green.bold(`Current Employees:`)
    );
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.table(rows);
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    promptUser();
  } catch (error) {
    console.error(error);
  }
};

// View all Roles
const viewAllRoles = async () => {
  try {
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` +
        chalk.green.bold(`Current Employee Roles:`)
    );
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    // INNER JOIN is used to combine rows from the role table and the department table based on the specified condition. In this case, the condition is specified in the ON clause
    const sql = `SELECT role.id, role.title, department.department_name AS department
                  FROM role
                  INNER JOIN department ON role.department_id = department.id`;
    const [rows] = await connection.promise().query(sql);

    rows.forEach((role) => {
      console.log(role.title);
    });

    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    promptUser();
  } catch (error) {
    console.error(error);
  }
};

// View all Departments
const viewAllDepartments = async () => {
  try {
    const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
    const [rows] = await connection.promise().query(sql);

    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` + chalk.green.bold(`All Departments:`)
    );
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.table(rows);
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    promptUser();
  } catch (error) {
    console.error(error);
  }
};

// View all Employees by Department
const viewEmployeesByDepartment = async () => {
  // LEFT JOIN is used to include all rows from the left table (employee in this case) and the matching rows from the right tables (role and department). If there is no match in the right tables, the result will still include the row from the left table, and the columns from the right tables will be filled with NULL values.
  try {
    const sql = `SELECT employee.first_name, 
                    employee.last_name, 
                    department.department_name AS department
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id`;
    const [rows] = await connection.promise().query(sql);

    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` +
        chalk.green.bold(`Employees by Department:`)
    );
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.table(rows);
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    promptUser();
  } catch (error) {
    console.error(error);
  }
};

// View all Departments by Budget
const viewDepartmentBudget = async () => {
  try {
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` +
        chalk.green.bold(`Budget By Department:`)
    );
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    //the INNER JOIN is used to combine rows from the role table and the department table where there is a match based on the specified condition.
    const sql = `SELECT department_id AS id, 
                    department.department_name AS department,
                    SUM(salary) AS budget
                    FROM  role  
                    INNER JOIN department ON role.department_id = department.id GROUP BY  role.department_id`;
    const [rows] = await connection.promise().query(sql);

    console.table(rows);
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    promptUser();
  } catch (error) {
    console.error(error);
  }
};

// --------------------------------------------------- ADD --------------------------------------------------------------------

// Add a New Employee
const addEmployee = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ]);

    const roleData = await connection
      .promise()
      .query("SELECT role.id, role.title FROM role");

    //roleData[0] accessing the result of the database query. In this case, it's assumed that the query returns an array, and [0] is used to access the first element of that array.
    // map function being called on the array obtained from the query result.
    // so what is a map?
    // The Array.map() method allows you to iterate over an array and modify its elements using a callback function.
    const roles = roleData[0].map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    // the roles below is coming from the mapped data above
    const roleChoice = await inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roles,
      },
    ]);

    const managerData = await connection
      .promise()
      .query("SELECT * FROM employee");
    const managers = managerData[0].map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    const managerChoice = await inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers,
      },
    ]);

    const crit = [
      answers.firstName,
      answers.lastName,
      roleChoice.role,
      managerChoice.manager,
    ];

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES (?, ?, ?, ?)`;

    await connection.promise().query(sql, crit);

    console.log("Employee has been added!");
    await viewAllEmployees();
  } catch (error) {
    console.error(error);
  }
};

// Add a New Role
const addRole = async () => {
  try {
    // const [response]: uses destructuring assignment to extract the first element of the array returned by the resolved Promise. In this case, the result of the query is an array, and [response] is extracting the first element (the first and only element in this case) and assigning it to the variable response.
    const [response] = await connection
      .promise()
      .query("SELECT * FROM department");

    //  create a new array (deptNamesArray) by extracting the values of the department_name property from each object in the response array. This array, deptNamesArray, will contain only the department names, creating a simplified representation of the original data from the "department" table.
    let deptNamesArray = response.map(
      (department) => department.department_name
    );
    deptNamesArray.push("Create Department");

    const answer = await inquirer.prompt([
      {
        name: "departmentName",
        type: "list",
        message: "Which department is this new role in?",
        choices: deptNamesArray,
      },
    ]);

    if (answer.departmentName === "Create Department") {
      await addDepartment();
    } else {
      await addRoleResume(answer);
    }
  } catch (error) {
    console.error(error);
  }
};

const addRoleResume = async (departmentData) => {
  try {
    const answer = await inquirer.prompt([
      {
        name: "newRole",
        type: "input",
        message: "What is the name of your new role?",
        validate: validate.validateString,
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of this new role?",
        validate: validate.validateSalary,
      },
    ]);

    let createdRole = answer.newRole;
    let departmentId;

    // Iterate over each element in departmentData array
    console.log("Department Data:", departmentData);
    if (Array.isArray(departmentData)) {
      // Iterate over each element in departmentData array
      departmentData.forEach((department) => {
        // Check if the current departmentData element's departmentName matches department.department_name
        if (answer.departmentName === department.department_name) {
          // If there's a match, assign the department's id to the variable departmentId
          departmentId = department.id;
        }
      });
    } else {
      console.error("Department data is not an array");
    }

    // Define an SQL query string for inserting a new role into the "role" table
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

    // Create an array crit containing values to be inserted into the SQL query
    const crit = [createdRole, answer.salary, departmentId];

    // Execute the SQL query asynchronously using the connection, passing the crit array as parameters
    await connection.promise().query(sql, crit);

    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    console.log(chalk.greenBright(`Role successfully created!`));
    console.log(
      chalk.green.bold(
        `====================================================================================`
      )
    );
    await viewAllRoles();
  } catch (error) {
    console.error(error);
  }
};

// Add a New Department
const addDepartment = async () => {
  try {
    const answer = await inquirer.prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "What is the name of your new Department?",
        validate: validate.validateString,
      },
    ]);

    const sql = `INSERT INTO department (department_name) VALUES (?)`;
    await connection.promise().query(sql, answer.newDepartment);

    console.log(``);
    console.log(
      chalk.greenBright(
        answer.newDepartment + ` Department successfully created!`
      )
    );
    console.log(``);
    await viewAllDepartments();
  } catch (error) {
    console.error(error);
  }
};

// ------------------------------------------------- UPDATE -------------------------------------------------------------------------

// Update an Employee's Role
const updateEmployeeRole = async () => {
  try {
    const [employeeResponse] = await connection.promise().query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
      FROM employee, role, department 
      WHERE department.id = role.department_id AND role.id = employee.role_id`
    );

    // Create an array employeeNamesArray by mapping over each element in employeeResponse
    // map in this context is to transform the array of employee objects (employeeResponse) into an array of strings, specifically, an array of full names
    let employeeNamesArray = employeeResponse.map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    );

    // Execute a SQL query to select role information and assign the result to roleResponse
    const [roleResponse] = await connection
      .promise()
      .query(`SELECT role.id, role.title FROM role`);

    // Create an array rolesArray by mapping over each element in roleResponse
    let rolesArray = roleResponse.map((role) => role.title);

    const answer = await inquirer.prompt([
      {
        name: "chosenEmployee",
        type: "list",
        message: "Which employee has a new role?",
        choices: employeeNamesArray,
      },
      {
        name: "chosenRole",
        type: "list",
        message: "What is their new role?",
        choices: rolesArray,
      },
    ]);

    let newTitleId, employeeId;

    roleResponse.forEach((role) => {
      if (answer.chosenRole === role.title) {
        newTitleId = role.id;
      }
    });

    employeeResponse.forEach((employee) => {
      if (
        answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
      ) {
        employeeId = employee.id;
      }
    });

    // Define an SQL query string for updating the role_id of an employee
    const sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
    // newTitleId would replace the first question mark (?) as the value for updating the role_id, and employeeId would replace the second question mark (?) as the condition for identifying the specific employee whose role_id is being updated.

    // Execute the SQL query asynchronously using the connection, passing [newTitleId, employeeId] as parameters
    await connection.promise().query(sql, [newTitleId, employeeId]);

    console.log(
      chalk.greenBright.bold(
        `====================================================================================`
      )
    );
    console.log(chalk.greenBright(`Employee Role Updated`));
    console.log(
      chalk.greenBright.bold(
        `====================================================================================`
      )
    );
    promptUser();
  } catch (error) {
    console.error(error);
  }
};

// Update an Employee's Manager
const updateEmployeeManager = async () => {
  try {
    const [response] = await connection.promise().query(
      `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
      FROM employee`
    );

    let employeeNamesArray = response.map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    );

    const answer = await inquirer.prompt([
      {
        name: "chosenEmployee",
        type: "list",
        message: "Which employee has a new manager?",
        choices: employeeNamesArray,
      },
      {
        name: "newManager",
        type: "list",
        message: "Who is their manager?",
        choices: employeeNamesArray,
      },
    ]);

    let employeeId, managerId;

    response.forEach((employee) => {
      if (
        answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
      ) {
        employeeId = employee.id;
      }

      if (
        answer.newManager === `${employee.first_name} ${employee.last_name}`
      ) {
        managerId = employee.id;
      }
    });

    if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      console.log(chalk.redBright(`Invalid Manager Selection`));
      console.log(
        chalk.redBright.bold(
          `====================================================================================`
        )
      );
      promptUser();
    } else {
      const sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;
      await connection.promise().query(sql, [managerId, employeeId]);

      console.log(
        chalk.greenBright.bold(
          `====================================================================================`
        )
      );
      console.log(chalk.greenBright(`Employee Manager Updated`));
      console.log(
        chalk.greenBright.bold(
          `====================================================================================`
        )
      );
      promptUser();
    }
  } catch (error) {
    console.error(error);
  }
};

// Delete an Employee
const removeEmployee = async () => {
  try {
    const [response] = await connection
      .promise()
      .query(
        `SELECT employee.id, employee.first_name, employee.last_name FROM employee`
      );

    let employeeNamesArray = response.map(
      (employee) => `${employee.first_name} ${employee.last_name}`
    );

    const answer = await inquirer.prompt([
      {
        name: "chosenEmployee",
        type: "list",
        message: "Which employee would you like to remove?",
        choices: employeeNamesArray,
      },
    ]);

    let employeeId;

    response.forEach((employee) => {
      if (
        answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
      ) {
        employeeId = employee.id;
      }
    });

    const sql = `DELETE FROM employee WHERE employee.id = ?`;
    // only one parameter (employeeId), you still need to pass it as an array because the query method expects an array of values to replace placeholders in the SQL query.
    await connection.promise().query(sql, [employeeId]);

    console.log(
      chalk.redBright.bold(
        `====================================================================================`
      )
    );
    console.log(chalk.redBright(`Employee Successfully Removed`));
    console.log(
      chalk.redBright.bold(
        `====================================================================================`
      )
    );
    await viewAllEmployees();
  } catch (error) {
    console.error(error);
  }
};

// Delete a Role
const removeRole = async () => {
  try {
    // Using [response] in the destructuring assignment extracts the first element of the array and assigns it to the variable response. This syntax is a concise way of accessing the result directly without having to reference it as result[0] later in the code.
    const [response] = await connection
      .promise()
      .query(`SELECT role.id, role.title FROM role`);

    let roleNamesArray = response.map((role) => role.title);

    const answer = await inquirer.prompt([
      {
        name: "chosenRole",
        type: "list",
        message: "Which role would you like to remove?",
        choices: roleNamesArray,
      },
    ]);

    let roleId;

    response.forEach((role) => {
      if (answer.chosenRole === role.title) {
        roleId = role.id;
      }
    });

    const sql = `DELETE FROM role WHERE role.id = ?`;
    await connection.promise().query(sql, [roleId]);

    console.log(
      chalk.redBright.bold(
        `====================================================================================`
      )
    );
    console.log(chalk.greenBright(`Role Successfully Removed`));
    console.log(
      chalk.redBright.bold(
        `====================================================================================`
      )
    );
    await viewAllRoles();
  } catch (error) {
    console.error(error);
  }
};

// Delete a Department
const removeDepartment = async () => {
  try {
    const [response] = await connection
      .promise()
      .query(
        `SELECT department.id, department.department_name FROM department`
      );

    let departmentNamesArray = response.map(
      (department) => department.department_name
    );

    const answer = await inquirer.prompt([
      {
        name: "chosenDept",
        type: "list",
        message: "Which department would you like to remove?",
        choices: departmentNamesArray,
      },
    ]);

    let departmentId;

    response.forEach((department) => {
      if (answer.chosenDept === department.department_name) {
        departmentId = department.id;
      }
    });

    const sql = `DELETE FROM department WHERE department.id = ?`;
    await connection.promise().query(sql, [departmentId]);

    console.log(
      chalk.redBright.bold(
        `====================================================================================`
      )
    );
    console.log(chalk.redBright(`Department Successfully Removed`));
    console.log(
      chalk.redBright.bold(
        `====================================================================================`
      )
    );
    await viewAllDepartments();
  } catch (error) {
    console.error(error);
  }
};
