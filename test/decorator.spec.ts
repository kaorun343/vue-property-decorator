"use strict";
import assert from "power-assert";
import {event, prop, watch, Data, PropOption} from "../src/vue-property-decorator";

describe("event decorator", () => {
    it("should add events to 'events' property", () => {
        class Test {
            @event("test.event")
            method() {
                //
            }

            @event("another.event")
            @event("more.event")
            anotherMethod() {
                //
            }

            static events: any;
        }
        assert.equal(Test.events["test.event"], "method");
        assert(Test.events["another.event"], "anotherMethod");
    });
});

describe("prop decorator", () => {
    it("should add props to 'props' property", () => {
        class Test {
            @prop(Number)
            propA: number;

            @prop({
                type: String,
                default: "propB"
            })
            propB: string;

            static props: any;
        }

        assert.equal(Test.props.propA, Number);
        assert.deepEqual(Test.props.propB, {type: String, default: "propB"});
    });
});

describe("watch decorator", () => {
    it("should add expressions to 'watch' property", () => {
        class Test {
            @watch("expression")
            method() {
                //
            }

            @watch("anotherExpression")
            @watch("moreExpression")
            anotherMethod() {
                //
            }

            static watch: any;
        }

        assert.equal(Test.watch["expression"], "method");
        assert.equal(Test.watch["anotherExpression"], "anotherMethod");
        assert.equal(Test.watch["moreExpression"], "anotherMethod");
    });
});


describe("Data decorator", () => {
    it("should add data to 'data' function", () => {
        @Data(() => ({ property: true }))
        class Test {
            property: boolean;

            data: Function;
        }

        assert.deepEqual((new Test()).data(), { property: true });
    });
});
