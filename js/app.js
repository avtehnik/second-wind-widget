let app = new Vue({
    el: '#app',
    data: {
        pollutionTypes: [
            {
                'colorClass': 'color1',
                'title': 'Задовільна якість',
                'description': 'Мінімальний вплив'
            },
            {
                'colorClass': 'color2',
                'title': 'Помірна якість',
                'description': 'Може викликати незначний дискомфорт'
            },
            {
                'colorClass': 'color3',
                'title': 'Шкідливе для чутливих груп',
                'description': 'Може викликати незначний дискомфорт'
            },
            {
                'colorClass': 'color4',
                'title': 'Шкідливе',
                'description': 'Шкідливе при тривалому вдиханні'
            },
            {
                'colorClass': 'color5',
                'title': 'Дуже шкідливе',
                'description': 'Шкідливе при вдиханні'
            },
            {
                'colorClass': 'color6',
                'title': 'Небезпечне',
                'description': 'Шкідливе при вдиханні'
            }
        ],
        aqi: 20,
        title: 'Задовільна якість',
        description: 'Мінімальний вплив',
        colorClass: 'color1',
        titleClass: null,
        minutes: 8
    },
    created: function() {
        t = this;
        axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.saveecobot.com/output.json')}`).then(function(response) {
            let data = JSON.parse(response.data.contents);

            let aqis = data.filter(function(item) {
                return item.cityName === "Cherkasy";
            }).map(function(item) {
                return item.pollutants.filter(function(pollutant) {
                    return pollutant.unit === "aqi";
                }).map(function(item) {
                    return {value: item.value, time: item.time};
                })
            })

            if (aqis.length) {
                let aqiSum = aqis.map(function(item) {
                    return item[0].value;
                }).reduce(function(a, b) {
                    return a + b
                }, 0);

                let time = aqis.map(function(item) {
                    return new Date(item[0].time);
                }).reduce(function(a, b) {
                    return a.getTime() > b.getTime() ? a : b;
                });

                let diff = Math.abs(new Date() - time);
                t.minutes = Math.floor((diff / 1000) / 60);

                t.aqi = Math.ceil(aqiSum / aqis.length);

                let item;
                if (t.aqi < 50) {
                    item = t.pollutionTypes[0];
                } else if (t.aqi < 100) {
                    item = t.pollutionTypes[1];
                } else if (t.aqi < 150) {
                    t.titleClass = 'header-sm';
                    item = t.pollutionTypes[2];
                } else if (t.aqi < 200) {
                    item = t.pollutionTypes[3];
                } else if (t.aqi < 300) {
                    item = t.pollutionTypes[4];
                } else {
                    item = t.pollutionTypes[5];
                }

                t.title = item.title;
                t.description = item.description;
                t.colorClass = item.colorClass;
            }
        });
    }
})

