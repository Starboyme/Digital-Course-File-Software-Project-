GlowScript 3.0 VPython

cwidth=800
cheight=600
bwidth=100
bheight=50
scene=canvas(width=cwidth,height=cheight)

heightofline=30
widthofline=1
sizeofbox=10

dic={}
#dic[1]="a"
#dic[2]="b"
#dic[3]={}
#dic[3][1]="r"
#dic[3][2]={}
#dic[3][3]="raj"
#dic[3][2][1]="p"
#dic[3][2][2]={}
#dic[3][2][2][1]="a"
#dic[3][2][2][2]="b"
#dic[3][2][2][3]="c"
#dic[3][2][3]="thukka"
#dic[4]="c"
#dic[5]="c"

d1=box(pos=vec(-300,200,0),color=color.red,size=vec(sizeofbox,sizeofbox,sizeofbox))

global org
org={'x':-300,'y':200,'z':0}

def anime(dic):
    flag=0
    for i in dic:
        l = box(pos=vec(org['x'],org['y']-(heightofline/2),org['z']),axis=vec(0,-1,0),size=vec(heightofline,widthofline,1),color=color.white)
        r = box(pos=vec(org['x']+(heightofline/2),org['y']-heightofline,org['z']),axis=vec(1,0,0),size=vec(heightofline,widthofline,1),color=color.white)
        b = box(pos=vec(org['x']+heightofline+5,org['y']-heightofline,org['z']),size=vec(sizeofbox,sizeofbox,sizeofbox),color=color.blue)
        tempy=org['y']-heightofline
        if(type(dic[i]) is type({})):
            b.color=color.red
            org['x']+=heightofline+5
            org['y']-=heightofline
            anime(dic[i])
            org['x']-=heightofline+5
            flag=1
        org['y']-=heightofline
        if flag==1:
            box(pos=vec(org['x'],org['y']+((tempy-org['y'])/2),org['z']),axis=vec(0,-1,0),size=vec(tempy-org['y'],widthofline,1),color=color.white)
            flag=0
        
def insert():  
    for i in range(5):
        key=int(input("Key: "))
        value=int(input("Value: "))
        dic[key]=value

def display():
    anime(dic)

while True:
    insertion=box(pos=vec(260,-200,0),size=vec(80,40,1),color=color.red)
    display=box(pos=vec(260,-140,0),size=vec(80,40,1),color=color.blue)
    ev = scene.waitfor('click')
    if ev.event == 'click':
        print(scene.mouse.pos)
        t=scene.mouse.pos
        if t.x>=220 and t.x<=300 and t.y>=-220 and t.x<=-180:
            insert()
        elif t.x>=220 and t.x<=300 and t.y>=-160 and t.y<=-120:
            display()
        
    
    

