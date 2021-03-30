GlowScript 3.0 VPython

cwidth=800
cheight=600
scene=canvas(width=cwidth,height=cheight,background=color.black)

li=100
hi=hv=50
wi=wv=1
lv=200

htxt=15

global org
org={'x':-300,'y':200,'z':1}

d1=box(pos=vec(org['x'],org['y'],org['z']),color=color.blue,size=vec(li,hi,wi))
d2=box(pos=vec(org['x']+li/2+lv/2+2,org['y'],org['z']),color=color.red,size=vec(lv,hv,wv))
t1=text(text='Index',align='center', color=color.black, pos=vec(org['x'],org['y'],org['z']),height=htxt)
t2=text(text='Value',align='center', color=color.black, pos=vec(org['x']+li/2+lv/2+2,org['y'],org['z']),height=htxt)

coordinatelist=[]
txtlist=[]
boxlist=[]
temp=org['y']
for i in range(1,10):
    temp-=(hi+1)
    box(pos=vec(org['x'],temp,org['z']),color=color.blue,size=vec(li,hi,wi))
    text(text=i,align='center', color=color.black, pos=vec(org['x'],temp,org['z']),height=htxt)
    txtlist.append([])
    boxlist.append([])
    coordinatelist.append([])
    boxlist[i-1].append(box(pos=vec(org['x']+li/2+lv/2+2,temp,org['z']),color=color.red,size=vec(lv,hv,wv)))
    txtlist[i-1].append(text(text=".",align='center', color=color.black, pos=vec(org['x']+li/2+lv/2+2,temp,org['z']),height=htxt))
    coordinatelist[i-1].append({'x':org['x']+li/2+lv/2+2,'y':temp,'z':org['z']})
    
#txtlist[2].visible=False
#text(text="raj",align='center', color=color.black, pos=vec(coordinatelist[2]['x'],coordinatelist[2]['y'],coordinatelist[2]['z']),height=htxt)

def getinput():
    key=int(input("Enter the key: "))
    value=input("Enter the value: ")
    hash=key%10-1
    if(txtlist[hash][0].text=="."):
        txtlist[hash][0].visible=False
        txtlist[hash][0]=text(text="key: "+str(key)+",value: "+str(value),align='center', color=color.black, pos=vec(coordinatelist[hash][0]['x'],coordinatelist[hash][0]['y'],coordinatelist[hash][0]['z']),height=htxt)
    else:
        endid=len(coordinatelist[hash])-1
        coord=vec(coordinatelist[hash][endid]['x']+lv+2,coordinatelist[hash][endid]['y'],coordinatelist[hash][endid]['z'])
        boxlist[hash].append(box(pos=coord,color=color.red,size=vec(lv,hv,wv)))
        txtlist[hash].append(text(text="key: "+str(key)+",value: "+str(value),align='center', color=color.black, pos=coord,height=htxt))
        coordinatelist[hash].append({'x':coordinatelist[hash][endid]['x']+lv+2,'y':coordinatelist[hash][endid]['y'],'z':coordinatelist[hash][endid]['z']})
    
def deletevalue():
    key=int(input("Enter the key: "))
    hash=key%10-1
    for i in range(len(txtlist[hash])):
        if(int(txtlist[hash][i].text.substring( 5, txtlist[hash][i].text.indexOf(",")))==key):
            boxlist[hash][i].visible=False
            coordinatelist[hash][i].visible=False
            txtlist[hash][i].visible=False
            coordinatelist[hash].pop()
            boxlist[hash].pop()
            txtlist[hash].pop()
    
def searchvalue():
    key=int(input("Enter the key: "))
    hash=key%10-1
    for i in range(len(txtlist[hash])):
        if(int(txtlist[hash][i].text.substring( 5, txtlist[hash][i].text.indexOf(",")))==key):
            boxlist[hash][i].color=vec(0,1,0)
            print(txtlist[hash][i].text)
            sleep(2)
            boxlist[hash][i].color=color.red
        
    
        

while True:
    insertion=box(pos=vec(260,-200,0),size=vec(80,40,1),color=color.red)
    deletion=box(pos=vec(260,-100,0),size=vec(80,40,1),color=color.red)
    search=box(pos=vec(260,0,0),size=vec(80,40,1),color=color.red)
    text(text='Insert',align='center', color=color.black, pos=vec(260,-200,0),height=htxt)
    text(text='Delete',align='center', color=color.black, pos=vec(260,-100,0),height=htxt)
    text(text='Search',align='center', color=color.black, pos=vec(260,0,0),height=htxt)
    ev = scene.waitfor('click')
    if ev.event == 'click':
        print(scene.mouse.pos)
        t=scene.mouse.pos
        if t.x>=220 and t.x<=300 and t.y>=-220 and t.y<=-180:
            getinput()
        elif t.x>=220 and t.x<=300 and t.y>=-120 and t.y<=-80:
            deletevalue()
        elif t.x>=220 and t.x<=300 and t.y>=-80 and t.y<=20:
            searchvalue()
        else:
    

