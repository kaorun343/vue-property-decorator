"use strict";
import * as Vue from "vue";
import * as assert from "power-assert";
import { Component, prop, watch } from "../src/vue-property-decorator";

describe("prop decorator", () => {
    it("should add props to 'props' property", () => {
        @Component<Test>({
            mounted() {
                this.propB;
            }
        })
        class Test extends Vue {
            @prop(Number)
            propA: number;

            @prop({
                type: String,
                default: "propB"
            })
            propB: string;
        }

        const { $options } = new Test();
        const { props } = $options;
        if (!(props instanceof Array)) {
            assert.deepEqual(props!["propA"], { type: Number });
            assert.deepEqual(props!["propB"], { type: String, default: "propB" });
        }
    });
});

describe("watch decorator", () => {
    it("should add expressions to 'watch' property", () => {
        @Component({})
        class Test extends Vue {
            @watch("expression")
            method() {
                //
            }

            @watch("anotherExpression")
            @watch("moreExpression")
            anotherMethod() {
                //
            }
        }

        const { $options } = new Test();
        assert.equal($options.watch!["expression"], "method");
        assert.equal($options.watch!["anotherExpression"], "anotherMethod");
        assert.equal($options.watch!["moreExpression"], "anotherMethod");
    });
});
