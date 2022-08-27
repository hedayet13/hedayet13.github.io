
$(document).ready(function(){
    $.getJSON("blog.json",function(data){
        var blogData = "";
        i=0;
        console.log(data.length)
        $.each(data,function(i,item){
            if(i<6){
            blogData += "<div class='blog-item' data-aos='flip-up'>"
            blogData += "<div style= 'width: 20vw;'><div style='display: flex;'><span class='material-icons icon'>"
            blogData += "folder_open"
            blogData += "</span>"
            // blogData += '<a href="'+item.url+'" style="text-align: right;width: 85%;text-decoration: none;color: aliceblue;"class="material-icons"> attach_file</a>'
            blogData += "</div></div>"
            blogData += '<a class="lol" id= "'+item.id+'" onclick="getId(this)"><h5 class="blog-heading">'+item.title+'</h5></a>'
            blogData += '<h6 class= "blog-description">'+ item.description +'</h6>'
            
            blogData += '<h6 class="bottom-part">'
            blogData += '<span class="firamono" style="margin-right: 10px;">'+item.tech[0]+'</span><span class="firamono">'+item.tech[1]+'</span></h6>'
            blogData += '</div></div>'
            i+=1;
            // console.log(i);
        }
        });
        $("#blog-list").html(blogData);
    })
})