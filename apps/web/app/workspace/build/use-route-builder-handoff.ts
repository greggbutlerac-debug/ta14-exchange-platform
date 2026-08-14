"use client";

import {useEffect,useState} from "react";
import {consumeRouteBuilderHandoff,ROUTE_BUILDER_HANDOFF_EVENT,type RouteBuilderHandoff} from "../../../lib/route-builder-handoff";

export type RouteBuilderHandoffState={handoff:RouteBuilderHandoff|null;checked:boolean};

export function useRouteBuilderHandoff():RouteBuilderHandoffState{
 const[state,setState]=useState<RouteBuilderHandoffState>({handoff:null,checked:false});
 useEffect(()=>{
  const read=()=>setState({handoff:consumeRouteBuilderHandoff(),checked:true});
  read();
  const handler=()=>read();
  window.addEventListener(ROUTE_BUILDER_HANDOFF_EVENT,handler);
  window.addEventListener('ta14:exchange-fork-staged',handler);
  return()=>{window.removeEventListener(ROUTE_BUILDER_HANDOFF_EVENT,handler);window.removeEventListener('ta14:exchange-fork-staged',handler)};
 },[]);
 return state;
}
