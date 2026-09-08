/* Bootstrap bridge for the final 13-module training alignment. */
(function(){
  try{
    window.c = supabase.createClient('https://roywoofgypiyoobdcrwx.supabase.co','sb_publishable_5SKEbO1wFS4LVZ6IcpWfnA_UQffaKX_',{auth:{persistSession:true,autoRefreshToken:true}});
    window.c.auth.getSession().then(function(r){
      var uid=r.data&&r.data.session&&r.data.session.user&&r.data.session.user.id;
      if(uid) window.employee={auth_user_id:uid};
    });
  }catch(e){console.warn('DASH training bootstrap',e);}
})();
