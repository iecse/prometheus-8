window.onload = function () {

    const events = {
        'Bamboozled': 1,
        'Battleship': 2,
        'Cicada': 3,
        'Gambit': 4,
        'Mystery Room': 6,
        'Negative Space': 7
    }

    const recordScore = document.getElementById('recordScoreSubmit');
    const updateScore = document.getElementById('updateScoreSubmit');
    const markAttendance = document.getElementById('markAttendanceSubmit');

    recordScore.addEventListener('click', function (e) {
        e.preventDefault();



        let scanner = new Instascan.Scanner({
            continuous: true,
            video: document.getElementById('preview'),
            mirror: false,
            backgroundScan: false,
            captureImage: false,
            refactoryPeriod: 5000,
            scanPeriod: 1
        });

        scanner.addListener('scan', function (qr) {
            const eventName = document.getElementById('recordScoreEventNum').value;
            const score = document.getElementById('recordScoreScore').value;
            const round = document.getElementById('recordScoreRound').value;
            const event = events[eventName];

            fetch('/api/results/record', {
                credentials: 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qr, event, score, round })
            })
                .then(resp => resp.json())
                .then(data => {
                    alert(data.msg)
                });
        });

        Instascan.Camera.getCameras()
            .then(function (cameras) {
                if (cameras.length > 0) scanner.start(cameras[cameras.length - 1]);
                else console.error('No cameras found');
            })
            .catch(function (e) {
                console.error(e);
            });
    })

    // markAttendance.addEventListener('click', function (e) {
    //     e.preventDefault();

    //     let scanner = new Instascan.Scanner({
    //         continuous: true,
    //         video: document.getElementById('preview'),
    //         mirror: false,
    //         backgroundScan: false,
    //         captureImage: false,
    //         refactoryPeriod: 5000,
    //         scanPeriod: 1
    //     });

    //     scanner.addListener('scan', function (qr) {
    //         const eventName = document.getElementById('markAttendanceEventNum').value;
    //         const round = document.getElementById('markAttendanceRound').value;
    //         const score = 0;
    //         const event = events[eventName];
    //         fetch('/api/results/record', {
    //             credentials: 'include',
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ qr, event, score, round })
    //         })
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 alert(data.msg)
    //             });
    //     });

    //     Instascan.Camera.getCameras()
    //         .then(function (cameras) {
    //             if (cameras.length > 0) scanner.start(cameras[cameras.length - 1]);
    //             else console.error('No cameras found');
    //         })
    //         .catch(function (e) {
    //             console.error(e);
    //         });
    // })

    updateScore.addEventListener('click', function (e) {
        e.preventDefault();
        const event = document.getElementById('updateScoreEventNum').value;
        const team = document.getElementById('updateScoreTeamID').value;
        const score = document.getElementById('updateScoreScore').value;

        fetch('/api/results/update', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event, score, team })
        })
            .then(resp => resp.json())
            .then(data => {
                alert(data.msg)
            });
    })
}
