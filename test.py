scene=canvas(width=800,height=600)
heightofline=30
widthofline=1
sizeofbox=10

d1=box(pos=vec(-300,200,0),color=color.red,size=vec(sizeofbox,sizeofbox,sizeofbox))

dic={}
dic[1]="a"
dic[2]="b"
dic[3]="c"
dic[4]="c"
dic[5]="c"

org={'x':-300,'y':200,'z':0}

for i in dic.keys():
    l = box(pos=vec(org['x'],org['y']-(heightofline/2),org['z']),axis=vec(0,-1,0),size=vec(heightofline,widthofline,1),color=color.white)
    r = box(pos=vec(org['x']+(heightofline/2),org['y']-heightofline,org['z']),axis=vec(1,0,0),size=vec(heightofline,widthofline,1),color=color.white)
    b = box(pos=vec(org['x']+heightofline+5,org['y']-heightofline,org['z']),size=vec(sizeofbox,sizeofbox,sizeofbox),color=color.blue)
    org['y']-=heightofline
    


