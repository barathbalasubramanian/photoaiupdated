

export async function FetchUserInFo(){
    noStore();
    const UserID = cookies();
    const User_Name = UserID.get('UserID').value;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
    const result = await supabase.from('Studio-Admin').select('*').eq('UserID',User_Name);
    return result.data[0];
}