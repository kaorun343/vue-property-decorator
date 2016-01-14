'use strict'
import assert from 'power-assert'
import {event, prop, watch} from '../lib/vue-property-decorator'

describe('vue-property-decorator', function () {
    beforeEach(function() {
      this.Test = function() {
        this.testProperty = {}
      }
      this.Test.prototype.testMethod = function() {}
    })
    describe('event decorator', function () {
        it('eventプロパティがあればそこに追加する', function () {
            this.Test.events = {};
            event('event:test')(this.Test.prototype, 'testMethod');
            assert.ok(Object.keys(this.Test.events).indexOf('event:test') > -1);
        });
        it('eventプロパティがない時は追加する', function () {
            event('event:test')(this.Test.prototype, 'testMethod');
            assert.ok(Object.keys(this.Test).indexOf('events') > -1);
            assert.ok(Object.keys(this.Test.events).indexOf('event:test') > -1);
        });
    });
    describe('prop decorator', function () {
        before(function () {
            this.PropOption = {
                type: Number,
                default: 1,
                required: false,
                twoWay: false,
                validator: function () { return true; }
            };
        });
        it('propsプロパティがある時はそこに追加する', function () {
            this.PropOption.props = {};
            prop(this.PropOption)(this.Test.prototype, 'testProperty');
            assert.ok(Object.keys(this.Test.props).indexOf('testProperty') > -1);
            assert.equal(this.Test.props.testProperty, this.PropOption);
        });
        it('propsプロパティがない時は追加する', function () {
            prop(this.PropOption)(this.Test.prototype, 'testProperty');
            assert.ok(Object.keys(this.Test).indexOf('props') > -1);
            assert.ok(Object.keys(this.Test.props).indexOf('testProperty') > -1);
            assert.equal(this.Test.props.testProperty, this.PropOption);
        });
    });
    describe('watch decorator', function () {
        before(function () {
            this.path = 'test.path';
        });
        it('watchプロパティがある時はそこに追加する', function () {
            this.Test.watch = {};
            watch(this.path)(this.Test.prototype, 'testMethod');
            assert.ok(Object.keys(this.Test.watch).indexOf(this.path) > -1);
            assert.equal(this.Test.watch[this.path], 'testMethod');
        });
        it('watchプロパティがない時は追加する', function () {
            watch(this.path)(this.Test.prototype, 'testMethod');
            assert.ok(Object.keys(this.Test).indexOf('watch') > -1);
            assert.ok(Object.keys(this.Test.watch).indexOf(this.path) > -1);
            assert.equal(this.Test.watch[this.path], 'testMethod');
        });
    });
});
