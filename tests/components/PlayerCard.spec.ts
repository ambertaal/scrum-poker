import { afterEach, describe, expect, test, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import type { ComponentPublicInstance } from "vue";
import PlayerCard from "../../src/components/PlayerCard.vue";
import type { UUID } from "@/stores/player";
import type { EstimateOption } from "@/types/estimates";

// Mock the API call used by handleRemoveClick (prevents real calls if you later test removal)
vi.mock("@/api/roomService", () => ({
  removePlayerFromRoom: vi.fn().mockResolvedValue(undefined),
}));

interface PlayerCardProps {
  playerId: UUID;
  roomId: string;
  playerName: string;
  estimate?: EstimateOption | null;
  reveal: boolean;
  myName: string;
}

type PlayerCardComponent = ComponentPublicInstance<PlayerCardProps>;

describe("PlayerCard component", () => {
  let wrapper: VueWrapper<PlayerCardComponent>;

  const defaultProps: PlayerCardProps = {
    playerId: "00000000-0000-0000-0000-000000000001" as UUID,
    roomId: "room-1",
    playerName: "Amber",
    estimate: null,
    reveal: false,
    myName: "SomeoneElse",
  };

  const mountPlayerCard = (props: Partial<PlayerCardProps> = {}) => {
    return mount(PlayerCard, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          TooltipProvider: { template: "<div><slot /></div>" },
          TooltipRoot: { template: "<div><slot /></div>" },
          TooltipTrigger: { template: "<div><slot /></div>" },
          TooltipPortal: { template: "<div><slot /></div>" },
          TooltipContent: { template: "<div><slot /></div>" },
          TooltipArrow: { template: "<div />" },

          Card: { template: "<div><slot /></div>" },
          CardContent: { template: "<div><slot /></div>" },
          Button: { template: "<button><slot /></button>" },
        },
      },
    });
  };

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  test("renders the player name", () => {
    wrapper = mountPlayerCard();
    expect(wrapper.text()).toContain("Amber");
  });

  test("estimate is null and reveal is false → shows question icon and back renders '-'", () => {
    wrapper = mountPlayerCard({ estimate: null, reveal: false });

    // Don’t assert SVG counts: both User and QuestionMark are SVGs.
    // Instead assert the back-face text is "-"
    const backEstimateSpan = wrapper
      .findAll("span")
      .find((s) => s.classes().includes("tracking-wide"));

    expect(backEstimateSpan).toBeTruthy();
    expect(backEstimateSpan!.text()).toBe("-");
  });

  test("estimate is set and reveal is false → shows estimate text in DOM (back)", () => {
    wrapper = mountPlayerCard({ estimate: "5" as EstimateOption, reveal: false });

    const backEstimateSpan = wrapper
      .findAll("span")
      .find((s) => s.classes().includes("tracking-wide"));

    expect(backEstimateSpan).toBeTruthy();
    expect(backEstimateSpan!.text()).toBe("5");
  });

  test("estimate is set and reveal is true → flip class is applied and estimate is rendered", () => {
    wrapper = mountPlayerCard({ estimate: "8" as EstimateOption, reveal: true });

    const flipContainer = wrapper.find('div[class*="transition-transform"]');
    expect(flipContainer.exists()).toBe(true);
    expect(flipContainer.attributes("class")).toContain("[transform:rotateY(180deg)]");

    const backEstimateSpan = wrapper
      .findAll("span")
      .find((s) => s.classes().includes("tracking-wide"));

    expect(backEstimateSpan).toBeTruthy();
    expect(backEstimateSpan!.text()).toBe("8");
  });

  test("estimate is empty string → back renders '-' (because estimate || '-')", () => {
    wrapper = mountPlayerCard({ estimate: "" as unknown as EstimateOption, reveal: true });

    const backEstimateSpan = wrapper
      .findAll("span")
      .find((s) => s.classes().includes("tracking-wide"));

    expect(backEstimateSpan).toBeTruthy();
    expect(backEstimateSpan!.text()).toBe("-");
  });
});
