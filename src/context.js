import React, { Component,createContext } from 'react'
//import items from './data';
import Client from './component/Contentful';


const RoomContext=createContext();

class RoomProvider extends Component {

    state={
        rooms:[],
        sortedRooms:[],
        featuredRooms:[],
        loading:true,
        type:'all',
        capacity:1,
        price:0,
        minPrice:0,
        maxPrice:0,
        minSize:0,
        maxSize:0,
        breakfast:false,
        pets:false
    };
    
    // get Data
    getData= async ()=>{
        try {

            let res=await Client.getEntries({
                content_type:'resApp'
            });
        
        const rooms=this.formatData(res.items);
        const featuredRooms=rooms.filter((room)=> room.featured === true);

        const maxPrice=Math.max(...rooms.map((item)=> item.price));
        const maxSize=Math.max(...rooms.map((item)=> item.size));
        
        this.setState({
            rooms,
            featuredRooms,
            sortedRooms:rooms,
            loading:false,
            price:maxPrice,
            maxPrice,
            maxSize
        })

        } catch (error) {
            console.log(error);
        }
    }
    
    componentDidMount(){
        this.getData();
    }

    formatData=(items)=>{
        const tempItems=items.map((item)=>{
            const id=item.sys.id;
            const images=item.fields.images.map((image)=>{
                return(image.fields.file.url)
            });
            const room={...item.fields,images,id};
            return room;
        });
        return tempItems;
    }


    getRoom=(slug)=>{
        const tempRoom=[...this.state.rooms];
        const room=tempRoom.find((room)=> room.slug === slug);
        return room;
    }

    handleChange=(event)=>{
        const target=event.target;
        const value=target.type === 'checkbox' ? target.checked : target.value;
        const name=event.target.name;

        this.setState({
            [name]:value
        },this.filterRoom)
        
    }

    filterRoom=()=>{
        let {rooms,type,capacity,price,minSize,maxSize,breakfast,pets}=this.state;
        //all the rooms
        let tempRooms=[...rooms];

        //transform values
        capacity=parseInt(capacity);
        price=parseInt(price);

        // filter by type
        if (type !== 'all') {
            tempRooms=tempRooms.filter((room)=> room.type === type);
        }

        //filter by capacity
        if (capacity !== 1) {
            tempRooms=tempRooms.filter((room)=> room.capacity >= capacity);
        }

        //filter by price
        tempRooms=tempRooms.filter((room)=> room.price <= price);

        //filter by size
        tempRooms=tempRooms.filter((room)=> room.size >= minSize && room.size <= maxSize);

        //filter by breakfast
        if (breakfast) {
            tempRooms=tempRooms.filter((room)=> room.breakfast === true);
        }

        //filter by pets
        if (pets) {
            tempRooms=tempRooms.filter((room)=> room.pets === true);
        }

        this.setState({
            sortedRooms:tempRooms
        })
        
    }

    render() {
        return (
            <RoomContext.Provider value={{
                ...this.state,
                getRoom:this.getRoom,
                handleChange:this.handleChange,
                filterRoom:this.filterRoom
                }}>
                {this.props.children}
            </RoomContext.Provider>
        )
    }


}

const RoomConsumer=RoomContext.Consumer;

export {RoomProvider,RoomConsumer,RoomContext};