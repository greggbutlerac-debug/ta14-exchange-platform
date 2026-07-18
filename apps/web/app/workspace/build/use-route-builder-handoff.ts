"use client";

import { useEffect, useState } from "react";
import {
  consumeRouteBuilderHandoff,
  type RouteBuilderHandoff,
} from "../../../lib/route-builder-handoff";

export type RouteBuilderHandoffState = {
  handoff: RouteBuilderHandoff | null;
  checked: boolean;
};

export function useRouteBuilderHandoff(): RouteBuilderHandoffState {
  const [state, setState] = useState<RouteBuilderHandoffState>({
    handoff: null,
    checked: false,
  });

  useEffect(() => {
    const handoff = consumeRouteBuilderHandoff();

    setState({
      handoff,
      checked: true,
    });
  }, []);

  return state;
}
