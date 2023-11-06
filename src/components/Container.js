import { useCallback, useEffect, useState } from 'react';
import { Card } from './Card';
import '../components/style.css';
import data from '../data';
import Swal from 'sweetalert2'

export const Container = () => {

    const [fileCount, setFileCount] = useState(0);
    const [checkedEle, setCheckedEle] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        setCards(data);
    }, []);


    const handleCheckboxChange = (event, id) => {
        if (event) {
            setCheckedEle([...checkedEle, id]);
            const parentDiv = document.getElementById(id).parentElement;
            parentDiv.classList.add("selected");
        } else {
            let filterArray = checkedEle.filter((item, index) => { return item !== id });
            setCheckedEle(filterArray);
            const parentDiv = document.getElementById(id).parentElement;
            parentDiv.classList.remove("selected");

        }
        setFileCount(event ? fileCount + 1 : fileCount - 1);
    };

    const handleDeleteFiles = () => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger me-2'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
                let cardFilter = cards;
                checkedEle.forEach((item) => {
                    cardFilter = cardFilter.filter((cardItem) => cardItem.id !== item);
                });
                setCards(cardFilter);
                setFileCount(0);
            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your file is safe :)',
                    'error'
                )
            }
        })
    };

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const newCards = [...cards];
        const draggedCard = newCards[dragIndex];
        newCards.splice(dragIndex, 1);
        newCards.splice(hoverIndex, 0, draggedCard);
        setCards(newCards);
    }, [cards]);

    return <div>
        {cards && <div className='d-flex align-items-center justify-content-center bg-custom-secondary'>
            <div className='image-gallery'>
                <div className='d-flex justify-content-between align-items-center px-5 py-2'>

                    {fileCount === 0 && (
                        <h5>Gallery</h5>
                    )}

                    {fileCount > 0 && (
                        <div className='d-flex align-items-center'>
                            <input type="checkbox" name="image2" id="image2" checked={fileCount > 0} />
                            <h5 className='ps-3'>{fileCount <= 1 ? `${fileCount} File Selected` : `${fileCount} Files Selected`}</h5>
                        </div>
                    )}
                    {fileCount > 0 && (
                        <h6 className='text-danger cursor-pointer' onClick={handleDeleteFiles}>{fileCount <= 1 ? `Delete file` : `Delete files`}</h6>
                    )}
                </div>
                <hr />
                <div className='container' >
                    {cards?.map((card, i) => (
                        <div key={card.id} className={i === 0 ? 'item1 cursor-grab' : 'cursor-grab'}>
                            <Card key={card.id} index={i} id={card.id} image={card.image} moveCard={moveCard} handleCheckboxChange={handleCheckboxChange} />
                        </div>
                    ))}
                </div>

            </div>
        </div>}
    </div>;
};
