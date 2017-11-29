var checkDate = require('../controller/appointmentCard.js');
var expect = require('chai').expect;

describe('Check Date Unit Test', function(){
    it('check if the date passed in is in the future',function(){
        expect(checkDate('2017-12-30')).to.be.equal(true);
    });

    it('check if the date passed in is in the future',function(){
        expect(checkDate('2017-11-10')).to.be.equal(false);
    });
});