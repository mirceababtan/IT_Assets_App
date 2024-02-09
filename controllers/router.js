const path = require('path');
const express = require('express');
const router = express.Router();
const Model = require(path.resolve(__dirname, '../models/models.js'));
const auth = require('./authentication');
const session = require('./session');
// const excelJS = require(path.resolve(__dirname, './excel.js'));

const database = new Model();

router.get('/', async (req,res) => {
    res.sendFile(path.resolve(__dirname,'../views/static/login-page.html'));
});

router.post('/login', async (req, res) => {
    try {
        const user = await auth.authenticateUser(req.body.username, req.body.password);
        if(user){
            req.session.user = user.username;
            await database.addLog(user.username, 'login');
            res.redirect('/homepage');
            console.log('User logged in: ' + user.username);
        } else{
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.get('/homepage', session.isLoggedIn, async(req, res) => {
    try {
        res.sendFile(path.resolve(__dirname, '../views/static/homepage.html'));
    } catch (error) {
        res.status(404).send('NOT FOUND');
        console.error(error);
    }
});


router.get('/homepage/devices',session.isLoggedIn,async (req,res) =>{
    try {
        const devices = await database.getAll('devices');
        const assignments = await database.getAll('employee_devices');

        const data = devices.map(device => {
            const isAssigned = assignments.some(assignment => assignment.id === device.id);
            return {
                id:device.id,
                status: isAssigned ? 'Taken' : 'Free',
                tag:device.tag,
                name:device.name,
                type:device.type,
                service_tag:device.service_tag,
                description:device.description
            }
        });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR.');
    }
} )

router.get('/homepage/employees', session.isLoggedIn, async(req,res) => {
    try{
        const data = await database.getAll('employees');
        res.json(data);
    } catch(error){
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR.');
    }
});

router.get('/devices-details', session.isLoggedIn, async(req,res) => {
    try {
        const auxDataOne = await database.search('employee_devices','id',req.query.value);
         if (auxDataOne.length > 0) {
            const auxDataTwo = await database.search('employees','marca',auxDataOne[0].marca);
            const data = [{
                id: auxDataTwo[0].id,
                last_name: auxDataTwo[0].last_name,
                first_name: auxDataTwo[0].first_name,
                marca: auxDataTwo[0].marca,
                department: auxDataTwo[0].department,
                function: auxDataTwo[0].function,
                date_in: auxDataOne[0].date_in
            }]
            res.json(data);
        } else {
            res.json([]);
        } 
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/archive-data',session.isLoggedIn, async(req,res) => {
    try {
        const auxData = await database.search('archive','id',req.query.value);
        if (auxData.length > 0) {
            const dataPromises = auxData.map(async (item) => {
                const auxDataTwo = await database.search('employees', 'marca', item.marca);
                return {
                    last_name: auxDataTwo[0].last_name,
                    first_name: auxDataTwo[0].first_name,
                    marca: auxDataTwo[0].marca,
                    department: auxDataTwo[0].department,
                    function: auxDataTwo[0].function,
                    date_in: item.date_in,
                    date_out: item.date_out
                };
            });
        
            Promise.all(dataPromises)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        } 
        else {
            res.json([]);
        }        
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/archive-data-employees',session.isLoggedIn, async(req,res) => {
    try {
        const auxData = await database.search('archive','marca',req.query.value);
        if (auxData.length > 0) {
            const dataPromises = auxData.map(async (item) => {
                const auxDataTwo = await database.search('devices', 'id', item.id);
                if(auxDataTwo.length > 0)
                    return {
                        id: auxDataTwo[0].id,
                        tag: auxDataTwo[0].tag,
                        name: auxDataTwo[0].name,
                        type: auxDataTwo[0].type,
                        service_tag: auxDataTwo[0].service_tag,
                        description: auxDataTwo[0].description,
                        date_in: item.date_in,
                        date_out: item.date_out
                    };
                else
                    return;
            });
        
            Promise.all(dataPromises)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        }
        else {
            res.json([]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});



router.get('/employees-details', session.isLoggedIn, async (req, res) => {
    try {
        const auxData = await database.search('employee_devices', 'marca', req.query.value);
        
        const data = [];

        for (const row of auxData) {
            const auxDataTwo = await database.search('devices', 'id', row.id);
            if (auxDataTwo.length > 0) {
                data.push({
                    id: auxDataTwo[0].id,
                    tag: auxDataTwo[0].tag,
                    name: auxDataTwo[0].name,
                    type: auxDataTwo[0].type,
                    service_tag: auxDataTwo[0].service_tag,
                    description: auxDataTwo[0].description,
                    date_in: row.date_in
                });
            }
        }

        res.json(data);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});


router.post('/add-device', session.isLoggedIn, async(req,res) => {
    try{
        const result = await database.addDevice(req.body);
        res.json(result);
    } catch(error){
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.post('/add-employee', session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.addEmployee(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/employee-names',session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.getEmployeeNames();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/employee-details',session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.getEmployeeDetails(req.query.value);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/device-names',session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.getAssignedDevices(req.query.value);
        res.json(result);
    } catch (error) {
        console.error(error);
    }
});

router.post('/assign-device',session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.assignDevice(req.body);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.delete('/unassign-device',session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.unassignDevice(req.body.id);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.delete('/delete-device', session.isLoggedIn, async(req,res) => {
    try {
        console.log(req.body.value);
        const result = await database.deleteDevice(req.body.value);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
})

router.delete('/delete-employee', session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.deleteEmployee(req.body.value);
        res.json(result);
    } catch (error) {
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/export-all-devices', session.isLoggedIn, async(req,res) => {
    try {
        const result = await database.getAll('devices');
        const assignments = await database.getAll('employee_devices');

        const data = result.map(device => {
            const isAssigned = assignments.some(assignment => assignment.id === device.id);
            return {
                id:device.id,
                status: isAssigned ? 'Taken' : 'Free',
                tag:device.tag,
                name:device.name,
                type:device.type,
                service_tag:device.service_tag,
                description:device.description
            }
        });
        res.json(data);        
        
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/documentation', session.isLoggedIn, async(req,res) => {
    try {
        res.sendFile(path.resolve(__dirname, '../views/static/documentation.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('/logout', session.isLoggedIn, async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.error(error); 
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});

router.get('*', async(req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.status(404).send('NOT FOUND');
    }
});

module.exports = router;



