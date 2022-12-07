// Step 1: Create jwt api (in server side)
const jwt = require('jsonwebtoken');
app.post('/jwt', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN);
    res.send({token});
});

// Step 2: Set jwt token to local storage (client side)
const email = result.user.email;
const currentUser = {email};
fetch('http://localhost:5000/jwt', {
    method: 'POST',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify(currentUser)
})
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('token', data.token);
        toast.success("Login Successful!", {
            position: 'bottom-center'
        });
        navigate(from, {replace: true});
    })
    .catch(err => console.log(err));

// Step 3: Get jwt token from local storage and send to server (client side)
useEffect(() => {
    fetch(`http://localhost:5000/notes/email/${user.email}`, {
        headers: {authorization: localStorage.getItem('token')}
    })
        .then(res => res.json())
        .then(data => setMyNotes(data))
        .catch(err => console.log(err));
}, [user.email]);

// Step 4: Create a verifyJWT middleware
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).send({message: 'Unauthorized Access'});
    }
    const token = authHeader;
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
        if(err) {
            return res.status(401).send({message: 'Unauthorized Access'});
        }
        req.decoded = decoded;
        next();
    });
}

// Step 5: Use verifyJWT middleware to targeted api
app.get('/notes/email/:email', verifyJWT, async (req, res) => {
    const decoded = req.decoded;
    const email = req.params.email;
    if(decoded.email !== email) {
        res.status(401).send({message: 'Unauthorized Access'});
    }
    const query = {userEmail: email};
    const result = await notesCollection.find(query).toArray();
    res.send(result);
});