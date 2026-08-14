import { createClient } from "./supabase/client";

export type ExchangeNetworkRoute={id:string;routeId:string;title:string;domain:string;owner:string;status:string;version:number;routeData:Record<string,unknown>;updatedAt:string};
export type ExchangeNetworkEvent={id:string;routeId:string;sourceRouteId:string|null;eventType:string;eventState:string;summary:string;actorLabel:string|null;eventData:Record<string,unknown>;occurredAt:string};
export type ExchangeNetworkSnapshot={routes:ExchangeNetworkRoute[];events:ExchangeNetworkEvent[];eventCounts:Record<string,number>;routeEventCounts:Record<string,Record<string,number>>};
type RouteRow={id:string;route_id:string;route_name:string;domain:string;owner:string;status:string;version:number;route_data:Record<string,unknown>;updated_at:string};
type EventRow={id:string;route_id:string;source_route_id:string|null;event_type:string;event_state:string;summary:string;actor_label:string|null;event_data:Record<string,unknown>;occurred_at:string};

export async function getExchangeNetworkSnapshot():Promise<ExchangeNetworkSnapshot>{
 const supabase=createClient();
 const[routesResult,eventsResult]=await Promise.all([
  supabase.from('exchange_routes').select('id,route_id,route_name,domain,owner,status,version,route_data,updated_at').order('updated_at',{ascending:false}).limit(100),
  supabase.from('exchange_route_events').select('id,route_id,source_route_id,event_type,event_state,summary,actor_label,event_data,occurred_at').eq('visibility','PUBLIC').order('occurred_at',{ascending:false}).limit(100)
 ]);
 if(routesResult.error)throw new Error(routesResult.error.message);if(eventsResult.error)throw new Error(eventsResult.error.message);
 const routes=((routesResult.data??[]) as RouteRow[]).map(row=>({id:row.id,routeId:row.route_id,title:row.route_name,domain:row.domain,owner:row.owner,status:row.status,version:row.version,routeData:row.route_data??{},updatedAt:row.updated_at}));
 const events=((eventsResult.data??[]) as EventRow[]).map(row=>({id:row.id,routeId:row.route_id,sourceRouteId:row.source_route_id,eventType:row.event_type,eventState:row.event_state,summary:row.summary,actorLabel:row.actor_label,eventData:row.event_data??{},occurredAt:row.occurred_at}));
 const eventCounts=events.reduce<Record<string,number>>((a,e)=>{a[e.eventType]=(a[e.eventType]??0)+1;return a},{});
 const routeEventCounts=events.reduce<Record<string,Record<string,number>>>((a,e)=>{for(const id of [e.routeId,e.sourceRouteId].filter(Boolean) as string[]){a[id]??={};a[id][e.eventType]=(a[id][e.eventType]??0)+1}return a},{});
 return{routes,events,eventCounts,routeEventCounts};
}
