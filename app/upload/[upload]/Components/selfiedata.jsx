"use server"
import { createClient } from '@supabase/supabase-js'

export default async function StoreSelfieData (SelfieData,EventName) {

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

    const SelfieDatas = await supabase.from('UserEvents').select('SelfieData').eq("EventName", `${EventName}`);
    let existingSelfieData = SelfieDatas.data[0].SelfieData;
    existingSelfieData.push(SelfieData);

    const data = await supabase.from('UserEvents').update({ 'SelfieData': existingSelfieData  }).eq('EventName',`${EventName}`).select('SelfieData');
    return data  
}
