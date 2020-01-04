import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

    const dish = props.dish;

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', flexDirection: 'row' }}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil-square'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.openAddComment()}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                    style={{ flex: 1, flexDirection: 'row' }}
                />

                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: 5,
            author: "",
            comment: ""
        };
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleComment(dishId) {
        this.toggleModal();
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    openAddComment={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={this.state.rating}
                            minValue={1}
                            onFinishRating={(rating) => this.setState({ rating: rating })}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder=' Author'
                            leftIcon={
                                <Icon
                                    type='font-awesome'
                                    name='user-o'
                                    size={24}
                                />
                            }
                            onChange={(author) => this.setState({ author: author })}
                        />
                        <Input
                            placeholder=' Comment'
                            leftIcon={
                                <Icon
                                    type='font-awesome'
                                    name='comment-o'
                                    size={24}
                                />
                            }
                            onChange={(comment) => this.setState({ comment: comment })}
                        />

                        <Button
                            onPress={() => { this.handleComment(dishId) }}
                            color="#512DA8"
                            title="SUBMIT"
                            style={{ marginBottom: 5 }}
                        />
                        <Button
                            onPress={() => { this.toggleModal() }}
                            title="CANCEL"
                            color="grey"
                        />
                    </View>
                </Modal>
            </ScrollView>);
    }

}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    },

    Button: {
        margin: 15,
        marginBottom: 5
    },
    Input: {
        marginBottom: 5
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);