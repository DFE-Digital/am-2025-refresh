require('dotenv').config();
const express = require('express');
const fs = require('fs')
const path = require('path')



function calculateValues(data, number) {
    const calculatedData = []

    console.log('calculating')

    data.forEach((item) => {
        const numberresult = Math.ceil((item.percent / 100) * number) // Round up to the nearest whole number so we can account for sub 1 %'s on low user numbers.
        calculatedData.push({
            measure: item.measure,
            number: numberresult,
            source: item.source,
            summary: item.summary,
            type: item.type
        })
    })
    calculatedData.sort((a, b) => b.number - a.number)

    return calculatedData
}

exports.g_howmanypeople = async function(req, res) {



    const number = parseInt(req.params.number | 0)
    if (number) {
        fs.readFile('./app/data/stats.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading data.json:', err)
                res.sendStatus(500)
                return
            }
            try {
                const jsonData = JSON.parse(data)
                const calculatedData = calculateValues(jsonData, number)

                res.render('app/how-many-people/index.html', {
                    number,
                    calculatedData
                })
            } catch (err) {
                console.error('Error parsing data.json:', err)
                res.sendStatus(500)
            }
        })
    } else {
        res.redirect('/app/how-many-people')
    }
}

exports.p_howmanypeople = async function(req, res) {
    const number = req.body.numberOfUsers

    // try and parse the number (it might have commas in)
    const parsedNumber = parseInt(number.replace(/,/g, ''))

    if (parsedNumber) {
        res.redirect('/app/how-many-people/' + parsedNumber)
    } else {
        res.redirect('/app/how-many-people')
    }
}