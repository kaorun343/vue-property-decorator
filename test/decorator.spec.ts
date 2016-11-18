import * as Vue from "vue";
import * as assert from "power-assert";
import { Component, prop, watch } from "../src/vue-property-decorator";

describe("prop decorator", () => {
    it("should add props to 'props' property", () => {
        @Component
        class Test extends Vue {
            @prop(Number)
            propA: number;

            @prop({ type: String, default: "propB" })
            propB: string;
        }

        const { $options } = new Test();
        const { props } = $options;
        if (!(props instanceof Array)) {
            assert.deepEqual(props!["propA"], { type: Number });
            assert.deepEqual(props!["propB"], { type: String, default: "propB" });
        }

        const test = new Test({ propsData: { propA: 10 }});
        assert.equal(test.propA, 10);
        assert.equal(test.propB, "propB");
    });
});

describe("watch decorator", () => {
    it("should add expressions to 'watch' property", () => {

        let num = 0;

        @Component
        class Test extends Vue {
            moreExpression = false;

            @watch("expression")
            @watch("moreExpression", { immediate: true })
            method() {
                num = 1;
            }
        }

        const { $options } = new Test();
        assert.equal(($options.watch!["expression"] as any).handler, "method");
        assert.equal(($options.watch!["moreExpression"] as any).immediate, true);

        const test = new Test();

        test.moreExpression = true;

        assert.equal(num, 1);
    });
});
