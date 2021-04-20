export const Root = 
  process.env.NODE_ENV === "development" ?
    {
      adminurl: "http://localhost:3000/admin/",
      socket : null,
      imageurl : "https://cms.pokergrid.io/uploads/",
      homepagedomain : "http://localhost:3000",
      admindomain : "http://localhost:3000",
      token : "admin_poker_token",
    }
      :
    {
      adminurl: "https://cms.pokergrid.io/admin/",
      socket : null,
      imageurl : "https://cms.pokergrid.io/uploads/",
      homepagedomain : "https://pokergrid.io",
      admindomain : "https://cms.pokergrid.io",
      token : "admin_poker_token",
    }

export const prefix = "poker-"
export const appprefix = "poker-"