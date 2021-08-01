fetch('http://home.gyaano.in/api/login', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        "email": "admin@gmail.com",
        "password": "admin123",
    }),
}).then((response) => response.json())
    .then(async (responseJson) => {
        this.setState({
            status: false,
        });

    })
    .catch((error) => {
        this.setState({
            status: false,
        });
        alert(error);
    });